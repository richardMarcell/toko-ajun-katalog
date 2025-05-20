"use server";

import { db } from "@/db";
import { salesFoodCorner, salesTemporary } from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { OrderTypeEnum } from "@/lib/enums/OrderTypeEnum";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import PermissionDeniedError from "@/lib/exceptions/permission-denied-error";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { storePayment } from "@/lib/services/payments/store-payment";
import { validatePayment } from "@/lib/services/payments/validate-payment";
import { can } from "@/lib/services/permissions/can";
import { deductStockFromSales } from "@/lib/services/sales/deduct-stock-from-sales";
import {
  getRecomposeSalesTemporary,
  getSalesTemporaryDiscounted,
  getSalesTemporaryWithTax,
  proccessSalesTransaction,
} from "@/lib/services/sales/proccess-sales-transaction";
import { DatabaseTransaction } from "@/types/db-transaction";
import { SalesTemporary } from "@/types/domains/pos/food-corner/sales/create";
import { ServerActionResponse } from "@/types/domains/server-action";
import { User } from "@/types/next-auth";
import { SalesIncludeRelation } from "@/types/sale";
import { and, desc, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeSalesSignlePaymentValidationSchema } from "./_libs/store-sales-single-payment-validation-schema";

type ValidatedValues = {
  sales_temporary_origin: SalesTemporary;
  total_payment: number;
  payment_method: string;
  wristband_code?: string | null;
  cardholder_name?: string | null;
  debit_card_number?: string | null;
  referenced_id?: string | null;
  debit_issuer_bank?: string | null;
  credit_card_number?: string | null;
  qris_issuer?: string | null;
  promo_code?: string | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function storeSalesSinglePayment(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  const permissionNames = [PermissionEnum.FOOD_CORNER_SALES_STORE];
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
  try {
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

    const validatedPayment = await validatePayment({
      grandTotal: salesTemporaryWithTax.grand_total,
      paymentMethod: validatedValues.payment_method as PaymentMethodEnum,
      totalPayment: validatedValues.total_payment,
      wristbandCode: validatedValues.wristband_code,
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
        sateliteConfig: SateliteUnitConfig.food_corner,
        transactionType: SalesTransactionTypeEnum.FOOD_CORNER_SALE,
        tx: tx,
        promoCode: validatedValues.promo_code,
      });
      salesId = sales.id;

      // Insert data to table sales food corner
      await storeSalesFoodCorner(validatedValues, tx, salesId);

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
      url: `/pos/food-corner/sales/${Number(salesId)}/receipt`,
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
          console.error(e.message);
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
  const validatedValues =
    await storeSalesSignlePaymentValidationSchema.validate(
      {
        sales_temporary_origin: JSON.parse(
          formData.get("sales_temporary_origin") as string,
        ),
        promo_code: formData.get("promo_code"),

        total_payment: formData.get("total_payment"),
        payment_method: formData.get("payment_method"),

        debit_card_number: formData.get("debit_card_number"),
        cardholder_name: formData.get("cardholder_name"),
        referenced_id: formData.get("referenced_id"),
        debit_issuer_bank: formData.get("debit_issuer_bank"),

        qris_issuer: formData.get("qris_issuer"),

        wristband_code: formData.get("wristband_code"),

        credit_card_number: formData.get("credit_card_number"),
      },
      {
        abortEarly: false,
      },
    );

  return validatedValues;
}

async function storeSalesFoodCorner(
  validatedValues: ValidatedValues,
  tx: DatabaseTransaction,
  salesId: bigint,
): Promise<void> {
  const orderType = validatedValues.sales_temporary_origin.order_type;
  const tableNumber =
    orderType == OrderTypeEnum.DINE_IN
      ? validatedValues.sales_temporary_origin.table_number
      : null;

  await tx.insert(salesFoodCorner).values({
    sales_id: salesId,
    order_number: await getOrderNumber(),
    table_number: tableNumber,
    order_type: orderType,
  });
}

async function storePaymentData(
  validatedValues: ValidatedValues,
  sales: SalesIncludeRelation,
  tx: DatabaseTransaction,
): Promise<void> {
  const isTunaiTransaction =
    validatedValues.payment_method === PaymentMethodEnum.TUNAI;
  const totalPayment = isTunaiTransaction
    ? validatedValues.total_payment
    : Number(sales.grand_total);
  const changeAmount = isTunaiTransaction
    ? validatedValues.total_payment - Number(sales.grand_total)
    : 0;
  await storePayment({
    salesId: sales.id,
    tx: tx,
    paymentSummary: {
      change_amount: changeAmount,
      total_payment: totalPayment,
      payment_method: validatedValues.payment_method as PaymentMethodEnum,
      debit_card_number: validatedValues.debit_card_number,
      cardholder_name: validatedValues.cardholder_name,
      referenced_id: validatedValues.referenced_id,
      debit_issuer_bank: validatedValues.debit_issuer_bank,
      wristband_code: validatedValues.wristband_code,
      wallet_transaction_type: WalletTransactionTypeEnum.FOOD_CORNER_SALE,
      credit_card_number: validatedValues.credit_card_number,
      qris_issuer: validatedValues.qris_issuer,
    },
  });
}

async function getOrderNumber(): Promise<string> {
  const lastRecordOfSales = await db
    .select({
      order_number: salesFoodCorner.order_number,
    })
    .from(salesFoodCorner)
    .where(sql`DATE(${salesFoodCorner.created_at}) = DATE(NOW())`)
    .orderBy(desc(salesFoodCorner.created_at))
    .limit(1);

  const lastNumber =
    lastRecordOfSales.length > 0
      ? Number(lastRecordOfSales[0].order_number.replace("#", ""))
      : 0;

  const orderNumber = `#${(lastNumber + 1).toString().padStart(4, "0")}`;

  return orderNumber;
}

async function destroySalesTemporary(tx: DatabaseTransaction, user: User) {
  await tx
    .delete(salesTemporary)
    .where(
      and(
        eq(salesTemporary.user_id, BigInt(user.id)),
        eq(
          salesTemporary.unit_business,
          SateliteUnitConfig.food_corner.unit_business,
        ),
      ),
    );
}
