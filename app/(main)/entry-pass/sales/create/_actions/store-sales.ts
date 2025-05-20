"use server";

import { db } from "@/db";
import { entryPassCustomerHistories, salesEntryPass } from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { storePayment } from "@/lib/services/payments/store-payment";
import { can } from "@/lib/services/permissions/can";
import {
  getRecomposeSalesTemporary,
  getSalesTemporaryWithTax,
  proccessSalesTransaction,
} from "@/lib/services/sales/proccess-sales-transaction";
import { getEntryPassCustomerHistory } from "@/repositories/domain/entry-pass/get-entry-pass-customer-history";
import { ServerActionResponse } from "@/types/domains/server-action";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { validationSchema } from "./_libs/validation-schema";
import { DatabaseTransaction } from "@/types/db-transaction";
import { EntryPassCustomerHistoryIncludeRelations } from "@/types/domains/entry-pass/sales/create";
import { SalesIncludeRelation } from "@/types/sale";
import PermissionDeniedError from "@/lib/exceptions/permission-denied-error";
import { validateMultiplePayments } from "@/lib/services/payments/validate-multiple-payments";
import getQVoucherValue from "@/lib/services/payments/get-q-voucher-value";

type ValidatedValues = {
  entry_pass_customer_history_id: number;
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
export async function storeSales(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const permissionNames = [PermissionEnum.ENTRY_PASS_SALES_STORE];
    const isAuthorized = await can({
      permissionNames: permissionNames,
      user: user,
    });

    if (!isAuthorized)
      throw new PermissionDeniedError({
        userId: user.id,
        userName: user.name,
        deniedPermissions: permissionNames.toString(),
      });

    let salesId: bigint | null = null;
    const validatedValues = await validateRequest(formData);

    const entryPassCustomerHistoryId = BigInt(
      validatedValues.entry_pass_customer_history_id,
    );
    const { entryPassCustomerHistory } = await getEntryPassCustomerHistory(
      entryPassCustomerHistoryId,
    );

    if (!entryPassCustomerHistory)
      return {
        status: "error",
        message:
          "Data entry pass tidak ditemukan atau data entry pass sudah dibayar",
      };

    const product = entryPassCustomerHistory.product;
    const salesTemporary = {
      sales_details: [
        {
          price: Number(product.price),
          qty: 1,
          product_id: Number(product.id),
        },
      ],
    };

    // Recompose sales data by retrieving the latest product prices and tax requirements from the database
    const recomposeSalesTemporary =
      await getRecomposeSalesTemporary(salesTemporary);

    // Add tax calculations to the discounted sales data based on the business unit's tax configuration
    const salesTemporaryWithTax = await getSalesTemporaryWithTax(
      recomposeSalesTemporary,
      SateliteUnitConfig.food_corner.unit_business,
    );

    const validatedPayment = await validateMultiplePayments({
      grandTotal: salesTemporaryWithTax.grand_total,
      payments: validatedValues.payments,
    });

    if (!validatedPayment.is_valid) {
      return {
        status: "error",
        message: validatedPayment.message,
      };
    }

    await db.transaction(async (tx) => {
      const sales = await proccessSalesTransaction({
        salesTemporary: salesTemporary,
        sateliteConfig: SateliteUnitConfig.entry_pass,
        transactionType: SalesTransactionTypeEnum.ENTRY_PASS,
        tx: tx,
      });
      salesId = sales.id;

      // Store sales swimming class
      await tx.insert(salesEntryPass).values({
        sales_id: salesId,
        created_by: BigInt(user.id),
        ep_customer_id: entryPassCustomerHistory.ep_customer_id,
      });

      // Assign Sales Id to Entry Pass Customer History
      await assignSalesIdToEntryPassCustomerHistory({
        salesId: sales.id,
        entryPassCustomerHistory,
        tx,
      });

      // Store data to table payments
      await storePaymentData(validatedValues, sales, tx);
    });

    return {
      status: "success",
      message: "Berhasil melakukan pembayaran",
      url: `/entry-pass/sales/${Number(salesId)}/receipt`,
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof PermissionDeniedError) {
      return {
        status: "error",
        message:
          "Gagal melakukan pembayaran. User tidak memiliki izin untuk melakukan tindakan ini",
      };
    }

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
  const validatedValues = await validationSchema.validate(
    {
      entry_pass_customer_history_id: formData.get(
        "entry_pass_customer_history_id",
      ),

      payments: JSON.parse(formData.get("payments") as string),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

async function assignSalesIdToEntryPassCustomerHistory({
  salesId,
  entryPassCustomerHistory,
  tx,
}: {
  salesId: bigint;
  entryPassCustomerHistory: EntryPassCustomerHistoryIncludeRelations;
  tx: DatabaseTransaction;
}) {
  await tx
    .update(entryPassCustomerHistories)
    .set({
      sales_id: salesId,
    })
    .where(eq(entryPassCustomerHistories.id, entryPassCustomerHistory.id));
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
        wallet_transaction_type: WalletTransactionTypeEnum.ENTRY_PASS,
        credit_card_number: payment.credit_card_number,
        qris_issuer: payment.qris_issuer,
        q_voucher_codes: payment.q_voucher_codes,
      },
    });
  }
}
