"use server";

import { db } from "@/db";
import {
  salesSwimsuitRent,
  stockSwimsuitRent,
  swimsuitRentWallet,
} from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { storePayment } from "@/lib/services/payments/store-payment";
import { validatePayment } from "@/lib/services/payments/validate-payment";
import { can } from "@/lib/services/permissions/can";
import {
  getRecomposeSalesTemporary,
  getSalesTemporaryWithTax,
  proccessSalesTransaction,
} from "@/lib/services/sales/proccess-sales-transaction";
import { ServerActionResponse } from "@/types/domains/server-action";
import { desc, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { validationSchema } from "./_libs/validation-schema";

type ValidatedValues = {
  customer_name: string;
  customer_phone_number: string;
  wristband_code: string;
  sales_details: {
    note?: string | null;
    qty: number;
    product_id: number;
    price: number;
    product_code: string;
    product_description: string;
    product_name: string;
    product_image: string;
    product_stock_qty: number;
  }[];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function storeSales(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SWIMSUIT_RENT_SALES_STORE],
    user: user,
  });

  let salesId: bigint | null = null;
  try {
    const validatedValues = await validateRequest(formData);

    // Recompose sales data by retrieving the latest product prices and tax requirements from the database
    const recomposeSalesTemporary = await getRecomposeSalesTemporary({
      sales_details: validatedValues.sales_details,
    });

    // Add tax calculations to the discounted sales data based on the business unit's tax configuration
    const salesTemporaryWithTax = await getSalesTemporaryWithTax(
      recomposeSalesTemporary,
      SateliteUnitConfig.food_corner.unit_business,
    );

    const validatedPayment = await validatePayment({
      grandTotal: salesTemporaryWithTax.grand_total,
      paymentMethod: PaymentMethodEnum.CASH_Q,
      totalPayment: 0,
      wristbandCode: validatedValues.wristband_code,
    });

    if (!validatedPayment.is_valid) {
      return {
        status: "error",
        message: validatedPayment.message,
      };
    }

    const walletWristbandList = await db.query.walletWristband.findMany({
      where: (walletWristband, { eq, and }) =>
        and(
          eq(walletWristband.wristband_code, validatedValues.wristband_code),
          eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
        ),
      with: {
        wallet: true,
      },
    });

    await db.transaction(async (tx) => {
      const sales = await proccessSalesTransaction({
        salesTemporary: {
          sales_details: validatedValues.sales_details,
        },
        sateliteConfig: SateliteUnitConfig.locker,
        transactionType: SalesTransactionTypeEnum.SWIMSUIT_RENT,
        tx: tx,
      });
      salesId = sales.id;

      // Create sales swimsuit rent record
      await tx.insert(salesSwimsuitRent).values({
        sales_id: salesId,
        order_number: await getOrderNumber(),
        customer_name: validatedValues.customer_name,
        customer_phone_number: validatedValues.customer_phone_number,
        wristband_code: validatedValues.wristband_code,
      });

      // Create swimsuit rent wallet records
      await tx.insert(swimsuitRentWallet).values(
        sales.salesDetails.map((detail) => ({
          sales_detail_id: detail.id,
          wallet_id: walletWristbandList[0].wallet_id,
        })),
      );

      // Update stock swimsuit rent
      await Promise.all(
        sales.salesDetails.map((detail) =>
          tx
            .update(stockSwimsuitRent)
            .set({
              qty: sql`${stockSwimsuitRent.qty} - ${detail.qty}`,
            })
            .where(eq(stockSwimsuitRent.product_id, BigInt(detail.product_id))),
        ),
      );

      // Store data to table payments
      await storePayment({
        salesId: salesId,
        tx: tx,
        paymentSummary: {
          change_amount: 0,
          total_payment: Number(sales.grand_total),
          payment_method: PaymentMethodEnum.CASH_Q,
          wristband_code: validatedValues.wristband_code,
          wallet_transaction_type: WalletTransactionTypeEnum.SWIMSUIT_RENT,
        },
      });
    });

    return {
      status: "success",
      message: "Berhasil melakukan pembayaran",
      url: `/swimsuit-rent/sales/${Number(salesId)}/receipt`,
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
  const validatedValues = await validationSchema.validate(
    {
      customer_name: formData.get("customer_name"),
      customer_phone_number: formData.get("customer_phone_number"),
      sales_details: JSON.parse(formData.get("sales_details") as string),
      wristband_code: formData.get("wristband_code"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

async function getOrderNumber(): Promise<string> {
  const lastRecordOfSales = await db
    .select({
      order_number: salesSwimsuitRent.order_number,
    })
    .from(salesSwimsuitRent)
    .where(sql`DATE(${salesSwimsuitRent.created_at}) = DATE(NOW())`)
    .orderBy(desc(salesSwimsuitRent.created_at))
    .limit(1);

  const lastNumber =
    lastRecordOfSales.length > 0
      ? Number(lastRecordOfSales[0].order_number.replace("#", ""))
      : 0;

  const orderNumber = `#${(lastNumber + 1).toString().padStart(4, "0")}`;

  return orderNumber;
}
