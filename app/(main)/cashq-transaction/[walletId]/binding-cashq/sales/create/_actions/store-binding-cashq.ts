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
import { validateMultiplePayments } from "@/lib/services/payments/validate-multiple-payments";
import { can } from "@/lib/services/permissions/can";
import { proccessSalesTransaction } from "@/lib/services/sales/proccess-sales-transaction";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";
import { DatabaseTransaction } from "@/types/db-transaction";
import { ServerActionResponse } from "@/types/domains/server-action";
import { Wallet } from "@/types/wallet";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { validationSchema } from "./_lib/validation-schema";
import { SalesIncludeRelation } from "@/types/sale";
import getQVoucherValue from "@/lib/services/payments/get-q-voucher-value";
import { storePayment } from "@/lib/services/payments/store-payment";

type ValidatedValues = {
  wallet_id: number;
  quantity: number;
  wristband_code_list: string[];
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
export default async function storeBindingCashQ(
  preState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    await can({
      permissionNames: [PermissionEnum.CASHQ_TRANSACTION_BINDING_CASHQ_STORE],
      user: user,
    });

    const validatedValues = await validateRequest(formData);
    const isCashQStoreToSales = isCashQStoreToSalesTable();
    const { wristbandProduct } = await getWristbandProduct();

    const deposit = wristbandProduct ? Number(wristbandProduct.price) : 0;
    const totalDeposit = deposit * validatedValues.quantity;

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

    const walletId = BigInt(validatedValues.wallet_id);
    let salesId: bigint | null = null;
    // let walletCashReceiveId: bigint | null = null;

    await db.transaction(async (tx) => {
      // Update status wristband to IN USE
      await updateStatusWristbandToInUse(validatedValues, tx);

      // Update deposit amount on wallet by input wallet id
      await updateWalletDepositAmount(walletId, totalDeposit, tx);

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
        const sales = await proccessSalesTransaction({
          salesTemporary: {
            sales_details: [
              {
                product_id: Number(wristbandProduct.id),
                price: Number(wristbandProduct.price),
                qty: validatedValues.quantity,
              },
            ],
          },
          sateliteConfig: SateliteUnitConfig.locker,
          transactionType: SalesTransactionTypeEnum.BINDING_CASHQ,
          tx: tx,
        });
        salesId = sales.id;

        // Store data to table payments
        await storePaymentData(validatedValues, sales, tx);
      }

      const wallet = await tx.query.wallets.findFirst({
        where: eq(wallets.id, walletId),
      });
      if (!wallet) throw new Error("Wallet doesn't exists");

      // Insert data wallet histories
      const walletHistoryId = await storeWalletHistoryDeposit({
        wallet,
        userId: BigInt(user.id),
        totalDeposit,
        validatedValues,
        tx,
        salesId: salesId as bigint,
      });

      // Insert data to wallet wristband
      await storeWalletWristband(validatedValues, walletHistoryId, tx);
    });

    return {
      status: "success",
      message: "Berhasil menyimpan data Binding CashQ",
      url: `/cashq-transaction/${walletId}/binding-cashq/sales/${salesId}/receipt`,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data binding CashQ. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan data binding CashQ. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await validationSchema.validate(
    {
      wallet_id: formData.get("wallet_id"),
      quantity: formData.get("quantity"),
      wristband_code_list: JSON.parse(
        formData.get("wristband_code_list") as string,
      ),

      payments: JSON.parse(formData.get("payments") as string),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

async function updateStatusWristbandToInUse(
  validatedValues: ValidatedValues,
  tx: DatabaseTransaction,
): Promise<void> {
  validatedValues.wristband_code_list.map(async (code) => {
    await tx
      .update(wristbands)
      .set({ status: WristbandStatusEnum.IN_USE })
      .where(eq(wristbands.code, code));
  });
}

async function updateWalletDepositAmount(
  walletId: bigint,
  totalDeposit: number,
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
        wallet_transaction_type: WalletTransactionTypeEnum.FOOD_CORNER_SALE,
        credit_card_number: payment.credit_card_number,
        qris_issuer: payment.qris_issuer,
        q_voucher_codes: payment.q_voucher_codes,
      },
    });
  }
}

async function storeWalletHistoryDeposit({
  tx,
  salesId,
  wallet,
  validatedValues,
  userId,
  totalDeposit,
}: {
  tx: DatabaseTransaction;
  salesId: bigint;
  wallet: Wallet;
  validatedValues: ValidatedValues;
  userId: bigint;
  totalDeposit: number;
}): Promise<bigint> {
  const walletHistoryCreated = await tx
    .insert(walletHistories)
    .values({
      wallet_id: wallet.id,
      sale_id: salesId,
      transaction_type: WalletTransactionTypeEnum.DEPOSIT,
      prev_saldo: Number(wallet.saldo).toString(),
      current_saldo: Number(wallet.saldo).toString(),
      deposit_wristband_qty: validatedValues.quantity,
      amount: totalDeposit.toString(),
      created_by: userId,
      // wallet_cash_receive_id: walletCashReceiveId,
    })
    .$returningId();
  const walletHistoryId = walletHistoryCreated[0].id;

  return walletHistoryId;
}

async function storeWalletWristband(
  validatedValues: ValidatedValues,
  walletHistoryId: bigint,
  tx: DatabaseTransaction,
) {
  await tx.insert(walletWristband).values(
    validatedValues.wristband_code_list.map((code) => ({
      wallet_id: BigInt(validatedValues.wallet_id),
      wristband_code: code,
      wallet_history_id: walletHistoryId,
    })),
  );
}
