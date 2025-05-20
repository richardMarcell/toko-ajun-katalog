"use server";

import { db } from "@/db";
import {
  walletHistories,
  wallets,
  walletWristband,
  wristbands,
} from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import { isCashQStoreToSalesTable } from "@/lib/helper";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import getQVoucherValue from "@/lib/services/payments/get-q-voucher-value";
import { storePayment } from "@/lib/services/payments/store-payment";
import { validateMultiplePayments } from "@/lib/services/payments/validate-multiple-payments";
import { can } from "@/lib/services/permissions/can";
import { proccessSalesTransaction } from "@/lib/services/sales/proccess-sales-transaction";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";
import { DatabaseTransaction } from "@/types/db-transaction";
import { ServerActionResponse } from "@/types/domains/server-action";
import { SalesIncludeRelation } from "@/types/sale";
import { Wallet } from "@/types/wallet";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeSalesValidationSchema } from "./_libs/store-sales-validation-schema";

type ValidatedValues = {
  wallet_id: number;
  locker_wallet_id: number;
  wristband_rent: {
    quantity: number;
    wristband_rent_code: string[];
  };
  payments: {
    total_payment: number;
    method: PaymentMethodEnum;
    wristband_code?: string | null;
    cardholder_name?: string | null;
    debit_card_number?: string | null;
    referenced_id?: string | null;
    debit_issuer_bank?: string | null;
    credit_card_number?: string | null;
    qris_issuer?: string | null;
    q_voucher_codes?: string[];
  }[];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function storeWallet(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const isAuthorized = await can({
      permissionNames: [PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_STORE],
      user: user,
    });
    if (!isAuthorized) throw new Error("User haven't permission");

    // let walletCashReceiveId: bigint | null = null;
    let salesId: bigint | null = null;

    const validatedValues = await validateRequest(formData);
    const isCashQStoreToSales = isCashQStoreToSalesTable();
    const { wristbandProduct } = await getWristbandProduct();

    const deposit = wristbandProduct ? Number(wristbandProduct.price) : 0;
    const totalDeposit = deposit * validatedValues.wristband_rent.quantity;

    const validatedPayment = await validateMultiplePayments({
      grandTotal: totalDeposit,
      payments: validatedValues.payments,
    });

    if (!validatedPayment.is_valid) {
      return {
        status: "error",
        message: validatedPayment.message,
      };
    }

    const wallet = await db.query.wallets.findFirst({
      where: eq(wallets.id, BigInt(validatedValues.wallet_id)),
      with: {
        walletWristbands: true,
      },
    });
    if (!wallet) throw new Error("Wallet not found");
    const walletId = wallet.id;

    await db.transaction(async (tx) => {
      // change status wristband to in use
      await updateWristbandStatusToInUse(validatedValues, tx);

      // Update Deposit Amount Value on Wallets
      await updateDepositAmount(totalDeposit, walletId, tx);

      // Note: this part is depreceted
      // const walletCashReceiveCreated = await tx
      //   .insert(walletCashReceive)
      //   .values({
      //     grand_total: totalDeposit.toString(),
      //     total_payment: totalPayment.toString(),
      //     change_amount: changeAmount.toString(),
      //     created_by: BigInt(user.id),
      //     payment_method: paymentMethod,
      //   })
      //   .$returningId();

      // walletCashReceiveId = walletCashReceiveCreated[0].id;

      if (isCashQStoreToSales && wristbandProduct) {
        const salesTemporary = {
          sales_details: [
            {
              product_id: Number(wristbandProduct.id),
              price: Number(wristbandProduct.price),
              qty: validatedValues.wristband_rent.quantity,
            },
          ],
        };

        const sales = await proccessSalesTransaction({
          salesTemporary: salesTemporary,
          sateliteConfig: SateliteUnitConfig.locker,
          transactionType: SalesTransactionTypeEnum.WRISTBAND_RENT,
          tx: tx,
        });
        salesId = sales.id;

        // Store data to table payments
        await storePaymentData(validatedValues, sales, tx);
      }

      // Store wallet history of deposit transaction
      const walletHistoryId = await storeWalletHistoryDepositTransaction({
        salesId: salesId as bigint,
        totalDeposit: totalDeposit,
        tx,
        userId: BigInt(user.id),
        validatedValues,
        wallet,
      });

      // Store Wallet Wristband
      await storeWalletWristband(
        validatedValues,
        walletId,
        walletHistoryId,
        tx,
      );
    });

    return {
      status: "success",
      message: "Berhasil melakukan pembayaran",
      url: `/cashq-transaction/${wallet.id}/locker-rent/${validatedValues.locker_wallet_id}/sales/${salesId}/receipt`,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message: "Gagal melakukan pembayaran. Terjadi kesalahan pada sistem",
      };
    }

    const errors: { [key: string]: string } = {};
    if (error.inner) {
      error.inner.forEach((e: any) => {
        if (e.path) {
          errors[e.path] = e.message;
        }
      });
    }

    return {
      status: "error",
      message:
        "Gagal melakukan pembayaran. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await storeSalesValidationSchema.validate(
    {
      wallet_id: formData.get("wallet_id") as string,
      locker_wallet_id: formData.get("locker_wallet_id") as string,
      wristband_rent: JSON.parse(formData.get("wristband_rent") as string),

      payments: JSON.parse(formData.get("payments") as string),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

async function updateWristbandStatusToInUse(
  validatedValues: ValidatedValues,
  tx: DatabaseTransaction,
): Promise<void> {
  validatedValues.wristband_rent.wristband_rent_code.map(async (code) => {
    await tx
      .update(wristbands)
      .set({ status: WristbandStatusEnum.IN_USE })
      .where(eq(wristbands.code, code));
  });
}

async function updateDepositAmount(
  totalDeposit: number,
  walletId: bigint,
  tx: DatabaseTransaction,
): Promise<void> {
  await tx
    .update(wallets)
    .set({
      deposit_amount: sql`${wallets.deposit_amount} + ${totalDeposit}`,
    })
    .where(eq(wallets.id, walletId));
}

async function storePaymentData(
  validatedValues: ValidatedValues,
  sales: SalesIncludeRelation,
  tx: DatabaseTransaction,
): Promise<void> {
  let remainingBalance = Number(sales.grand_total);
  for (const payment of validatedValues.payments) {
    const isTunaiTransaction = payment.method === PaymentMethodEnum.TUNAI;

    const changeAmount = isTunaiTransaction
      ? Math.max(0, payment.total_payment - remainingBalance)
      : 0;

    const isQVoucherTransaction =
      payment.method === PaymentMethodEnum.Q_VOUCHER;

    if (isQVoucherTransaction) {
      const voucherList = getQVoucherValue(payment.q_voucher_codes);
      const totalVoucherValue = voucherList.reduce(
        (sum, voucher) => sum + voucher.value,
        0,
      );
      remainingBalance -= totalVoucherValue;
    } else remainingBalance -= payment.total_payment;

    await storePayment({
      salesId: sales.id,
      tx,
      paymentSummary: {
        change_amount: changeAmount,
        total_payment: payment.total_payment,
        payment_method: payment.method as PaymentMethodEnum,
        debit_card_number: payment.debit_card_number,
        cardholder_name: payment.cardholder_name,
        referenced_id: payment.referenced_id,
        debit_issuer_bank: payment.debit_issuer_bank,
        wristband_code: payment.wristband_code,
        wallet_transaction_type: WalletTransactionTypeEnum.WRISTBAND_RENT,
        credit_card_number: payment.credit_card_number,
        qris_issuer: payment.qris_issuer,
        q_voucher_codes: payment.q_voucher_codes,
      },
    });
  }
}

async function storeWalletHistoryDepositTransaction({
  wallet,
  totalDeposit,
  validatedValues,
  salesId,
  userId,
  tx,
}: {
  wallet: Wallet;
  totalDeposit: number;
  validatedValues: ValidatedValues;
  salesId: bigint;
  userId: bigint;
  tx: DatabaseTransaction;
}): Promise<bigint> {
  const walletHistoryCreated = await tx
    .insert(walletHistories)
    .values({
      wallet_id: wallet.id,
      // wallet_cash_receive_id: walletCashReceiveId,
      transaction_type: WalletTransactionTypeEnum.DEPOSIT,
      prev_saldo: wallet.saldo,
      current_saldo: wallet.saldo,
      amount: totalDeposit.toString(),
      created_by: userId,
      deposit_wristband_qty: validatedValues.wristband_rent.quantity,
      sale_id: salesId,
    })
    .$returningId();

  const walletHistoryId = walletHistoryCreated[0].id;

  return walletHistoryId;
}

async function storeWalletWristband(
  validatedValues: ValidatedValues,
  walletId: bigint,
  walletHistoryId: bigint,
  tx: DatabaseTransaction,
) {
  await tx.insert(walletWristband).values(
    validatedValues.wristband_rent.wristband_rent_code.map((code) => ({
      wallet_id: walletId,
      wristband_code: code,
      wallet_history_id: walletHistoryId,
    })),
  );
}
