"use server";

import { db } from "@/db";
import { walletHistories, wallets } from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { isCashQStoreToSalesTable } from "@/lib/helper";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import getQVoucherValue from "@/lib/services/payments/get-q-voucher-value";
import { storePayment } from "@/lib/services/payments/store-payment";
import { validateMultiplePayments } from "@/lib/services/payments/validate-multiple-payments";
import { can } from "@/lib/services/permissions/can";
import { proccessSalesTransaction } from "@/lib/services/sales/proccess-sales-transaction";
import { getTopUpProduct } from "@/repositories/domain/general/get-top-up-product";
import { DatabaseTransaction } from "@/types/db-transaction";
import { ServerActionResponse } from "@/types/domains/server-action";
import { SalesIncludeRelation } from "@/types/sale";
import { Wallet } from "@/types/wallet";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeSalesValidationSchema } from "./_libs/store-sales-validation-schema";

type ValidatedValues = {
  wallet_id: number;
  amount: number;
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
export async function updateSaldoWallet(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    await can({
      permissionNames: [PermissionEnum.CASHQ_TRANSACTION_TOP_UP_STORE],
      user: user,
    });

    let salesId: bigint | null = null;

    const validatedValues = await validateRequest(formData);
    const isCashQStoreToSales = isCashQStoreToSalesTable();
    const { topUpProduct } = await getTopUpProduct();

    const validatedPayment = await validateMultiplePayments({
      grandTotal: validatedValues.amount,
      payments: validatedValues.payments,
    });

    if (!validatedPayment.is_valid) {
      return {
        status: "error",
        message: validatedPayment.message,
      };
    }

    const walletId = BigInt(validatedValues.wallet_id);
    const wallet = await db.query.wallets.findFirst({
      where: eq(wallets.id, BigInt(walletId)),
    });
    if (!wallet) throw new Error("Wallet doesn't exists");

    await db.transaction(async (tx) => {
      if (isCashQStoreToSales && topUpProduct) {
        const salesTemporary = {
          sales_details: [
            {
              product_id: Number(topUpProduct.id),
              price: validatedValues.amount,
              qty: 1,
            },
          ],
        };
        const sales = await proccessSalesTransaction({
          salesTemporary: salesTemporary,
          sateliteConfig: SateliteUnitConfig.locker,
          transactionType: SalesTransactionTypeEnum.TOP_UP,
          tx: tx,
        });
        salesId = sales.id;

        // Store data to table payments
        await storePaymentData(validatedValues, sales, tx);
      }

      // Note: This part is depreceted
      // const walletCashReceiveCreated = await tx
      //   .insert(walletCashReceive)
      //   .values({
      //     grand_total: salesSummary.grand_total.toString(),
      //     total_payment: totalPayment.toString(),
      //     change_amount: changeAmount.toString(),
      //     created_by: BigInt(user.id),
      //     payment_method: paymentMethod,
      //   })
      //   .$returningId();
      // const walletCashReceiveId = walletCashReceiveCreated[0].id;

      // Store wallet history top up and update wallet saldo
      await storeWalletHistoryTopUp({
        validatedValues,
        wallet,
        userId: BigInt(user.id),
        salesId: salesId as bigint,
        tx,
      });
    });

    return {
      status: "success",
      message: "Berhasil melakukan pembayaran",
      url: `/cashq-transaction/${walletId}/top-up/sales/${salesId}/receipt`,
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
      amount: formData.get("amount") as string,

      payments: JSON.parse(formData.get("payments") as string),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
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

async function storeWalletHistoryTopUp({
  wallet,
  salesId,
  tx,
  userId,
  validatedValues,
}: {
  wallet: Wallet;
  salesId: bigint;
  userId: bigint;
  tx: DatabaseTransaction;
  validatedValues: ValidatedValues;
}): Promise<void> {
  const currentSaldo = validatedValues.amount + Number(wallet.saldo);
  const topUpAmount = validatedValues.amount.toString();
  await tx.insert(walletHistories).values({
    wallet_id: wallet.id,
    sale_id: salesId,
    transaction_type: WalletTransactionTypeEnum.TOP_UP,
    prev_saldo: wallet.saldo,
    current_saldo: currentSaldo.toString(),
    amount: topUpAmount,
    created_by: userId,
    // wallet_cash_receive_id: walletCashReceiveId,
  });

  await tx
    .update(wallets)
    .set({ saldo: currentSaldo.toString() })
    .where(eq(wallets.id, BigInt(wallet.id)));
}
