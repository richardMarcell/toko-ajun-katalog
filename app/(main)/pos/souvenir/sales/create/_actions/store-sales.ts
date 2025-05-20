"use server";

import { db } from "@/db";
import { salesTemporary } from "@/db/schema";
import { salesSouvenir } from "@/db/schema/sales-souvenir";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { storePayment } from "@/lib/services/payments/store-payment";
import { can } from "@/lib/services/permissions/can";
import { deductStockFromSales } from "@/lib/services/sales/deduct-stock-from-sales";
import {
  getRecomposeSalesTemporary,
  getSalesTemporaryDiscounted,
  getSalesTemporaryWithTax,
  proccessSalesTransaction,
} from "@/lib/services/sales/proccess-sales-transaction";
import { DatabaseTransaction } from "@/types/db-transaction";
import { SalesTemporary } from "@/types/domains/pos/souvenir/sales/create";
import { ServerActionResponse } from "@/types/domains/server-action";
import { User } from "@/types/next-auth";
import { SalesIncludeRelation } from "@/types/sale";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeSalesValidationSchema } from "./_libs/store-sales-validation-schema";
import PermissionDeniedError from "@/lib/exceptions/permission-denied-error";
import { validateMultiplePayments } from "@/lib/services/payments/validate-multiple-payments";
import getQVoucherValue from "@/lib/services/payments/get-q-voucher-value";

type ValidatedValues = {
  sales_temporary_origin: SalesTemporary;
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
  promo_code?: string | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function storeSales(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const permissionNames = [PermissionEnum.SOUVENIR_SALES_STORE];
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

    // Recompose sales data by retrieving the latest product prices and tax requirements from the database
    const recomposeSalesTemporary = await getRecomposeSalesTemporary(
      validatedValues.sales_temporary_origin,
    );

    // Apply promo (if any) to the recomposed sales data
    const salesTemporaryDiscounted = await getSalesTemporaryDiscounted(
      recomposeSalesTemporary,
      validatedValues.promo_code,
    );

    // Add tax calculations to the discounted sales data based on the business unit's tax configuration
    const salesTemporaryWithTax = await getSalesTemporaryWithTax(
      salesTemporaryDiscounted,
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
        salesTemporary: validatedValues.sales_temporary_origin,
        sateliteConfig: SateliteUnitConfig.souvenir,
        transactionType: SalesTransactionTypeEnum.SOUVENIR_SALE,
        tx: tx,
        promoCode: validatedValues.promo_code,
      });
      salesId = sales.id;

      // Insert data to table sales souvenir
      await storeSalesSouvenir(validatedValues, tx, salesId);

      // Store data to table payments
      await storePaymentData(validatedValues, sales, tx);

      // Deduct stock of product
      await deductStockFromSales({ sales, tx });

      // Delete sales temporary data
      await destroySalesTemporary(tx, user);
    });

    return {
      status: "success",
      message: "Berhasil melakukan pembayaran",
      url: `/pos/souvenir/sales/${Number(salesId)}/receipt`,
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
  const validatedValues = await storeSalesValidationSchema.validate(
    {
      sales_temporary_origin: JSON.parse(
        formData.get("sales_temporary_origin") as string,
      ),
      promo_code: formData.get("promo_code"),
      payments: JSON.parse(formData.get("payments") as string),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

async function storeSalesSouvenir(
  validatedValues: ValidatedValues,
  tx: DatabaseTransaction,
  salesId: bigint,
): Promise<void> {
  await tx.insert(salesSouvenir).values({
    sales_id: salesId,
    customer_name: validatedValues.sales_temporary_origin.customer_name ?? null,
  });
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
        wallet_transaction_type: WalletTransactionTypeEnum.SOUVENIR_SALE,
        credit_card_number: payment.credit_card_number,
        qris_issuer: payment.qris_issuer,
        q_voucher_codes: payment.q_voucher_codes,
      },
    });
  }
}

async function destroySalesTemporary(tx: DatabaseTransaction, user: User) {
  await tx
    .delete(salesTemporary)
    .where(
      and(
        eq(salesTemporary.user_id, BigInt(user.id)),
        eq(
          salesTemporary.unit_business,
          SateliteUnitConfig.souvenir.unit_business,
        ),
      ),
    );
}
