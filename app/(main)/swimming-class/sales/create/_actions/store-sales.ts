"use server";

import { db } from "@/db";
import {
  salesSwimmingClass,
  swimmingClassCustomerHistories,
} from "@/db/schema";
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
import { getSwimmingClassCustomerHistory } from "@/repositories/domain/swimming-class/get-swimming-class-customer-history";
import { DatabaseTransaction } from "@/types/db-transaction";
import { ServerActionResponse } from "@/types/domains/server-action";
import { SwimmingClassCustomerHistoryIncludeRelations } from "@/types/domains/swimming-class/sales/create";
import { SalesIncludeRelation } from "@/types/sale";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { validationSchema } from "./_libs/validation-schema";
import PermissionDeniedError from "@/lib/exceptions/permission-denied-error";
import { validateMultiplePayments } from "@/lib/services/payments/validate-multiple-payments";
import getQVoucherValue from "@/lib/services/payments/get-q-voucher-value";

type ValidatedValues = {
  swimming_class_customer_history_id: number;
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

    const permissionNames = [PermissionEnum.SWIMMING_CLASS_SALES_STORE];
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

    const swimmingClassCustomerHistoryId = BigInt(
      validatedValues.swimming_class_customer_history_id,
    );
    const { swimmingClassCustomerHistory } =
      await getSwimmingClassCustomerHistory(swimmingClassCustomerHistoryId);

    if (!swimmingClassCustomerHistory)
      return {
        status: "error",
        message:
          "Data kelas renang tidak ditemukan atau data kelas renang sudah dibayar",
      };

    const product = swimmingClassCustomerHistory.product;
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
        sateliteConfig: SateliteUnitConfig.swimming_class,
        transactionType: SalesTransactionTypeEnum.SWIMMING_CLASS,
        tx: tx,
      });
      salesId = sales.id;

      // Store sales swimming class
      await tx.insert(salesSwimmingClass).values({
        sales_id: salesId,
        created_by: BigInt(user.id),
        sc_customer_id: swimmingClassCustomerHistory.sc_customer_id,
        valid_for:
          swimmingClassCustomerHistory.product.swimming_class_valid_for,
      });

      // Assign Sales Id to Swimmng Class Customer History
      await assignSalesIdToSwimmingClassCustomerHistory({
        salesId: sales.id,
        swimmingClassCustomerHistory,
        tx,
      });

      // Store data to table payments
      await storePaymentData(validatedValues, sales, tx);
    });

    return {
      status: "success",
      message: "Berhasil melakukan pemabayaran",
      url: `/swimming-class/sales/${Number(salesId)}/receipt`,
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
          console.error("Yup validation error", e.message);
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
      swimming_class_customer_history_id: formData.get(
        "swimming_class_customer_history_id",
      ),

      payments: JSON.parse(formData.get("payments") as string),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

async function assignSalesIdToSwimmingClassCustomerHistory({
  salesId,
  swimmingClassCustomerHistory,
  tx,
}: {
  salesId: bigint;
  swimmingClassCustomerHistory: SwimmingClassCustomerHistoryIncludeRelations;
  tx: DatabaseTransaction;
}) {
  await tx
    .update(swimmingClassCustomerHistories)
    .set({
      sales_id: salesId,
    })
    .where(
      eq(swimmingClassCustomerHistories.id, swimmingClassCustomerHistory.id),
    );
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
        wallet_transaction_type: WalletTransactionTypeEnum.SWIMMING_CLASS,
        credit_card_number: payment.credit_card_number,
        qris_issuer: payment.qris_issuer,
        q_voucher_codes: payment.q_voucher_codes,
      },
    });
  }
}
