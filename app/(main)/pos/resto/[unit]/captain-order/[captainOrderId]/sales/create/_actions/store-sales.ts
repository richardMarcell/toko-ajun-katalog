"use server";

import { getCaptainOrder } from "@/app/(main)/pos/resto/_repositories/get-captain-order";
import { db } from "@/db";
import { ProductConfig } from "@/lib/config/product-config";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { deductStockFromSales } from "@/lib/services/sales/deduct-stock-from-sales";
import {
  getRecomposeSalesTemporary,
  getSalesTemporaryDiscounted,
  getSalesTemporaryWithTax,
  proccessSalesTransaction,
} from "@/lib/services/sales/proccess-sales-transaction";
import { ServerActionResponse } from "@/types/domains/server-action";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeSalesValidationSchema } from "./_libs/store-sales-validation-schema";
import { SalesIncludeRelation } from "@/types/sale";
import { DatabaseTransaction } from "@/types/db-transaction";
import { captainOrderDetails, sales } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { storePayment } from "@/lib/services/payments/store-payment";
import PermissionDeniedError from "@/lib/exceptions/permission-denied-error";
import { validateMultiplePayments } from "@/lib/services/payments/validate-multiple-payments";
import getQVoucherValue from "@/lib/services/payments/get-q-voucher-value";

type SaleDetail = {
  product_id: number;
  product_name: string;
  qty: number;
  price: number;
  note?: string | null;
};

type RestoSalesTemporary = {
  captain_order_id: number;
  sales_details: SaleDetail[];
  total_gross: number;
  total_net: number;
  grand_total: number;
  tax_percent: number;
  tax_amount: number;
  discount_percent: number;
  discount_amount: number;
  created_at?: Date;
};

type ValidatedValues = {
  resto_sales_temporary: RestoSalesTemporary;
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

    const permissionNames = [PermissionEnum.RESTO_PATIO_SALES_STORE];
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

    const captainOrderIdValidated =
      validatedValues.resto_sales_temporary.captain_order_id.toString();

    const { captainOrder } = await getCaptainOrder(captainOrderIdValidated);
    if (!captainOrder) {
      return {
        status: "error",
        message: "Captain order tidak terdaftar dalam sistem",
      };
    }

    // Recompose sales data by retrieving the latest product prices and tax requirements from the database
    const recomposeSalesTemporary = await getRecomposeSalesTemporary(
      validatedValues.resto_sales_temporary,
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
      const restoSalesTemporaryOrigin = validatedValues.resto_sales_temporary;
      const specialItemId = ProductConfig.special_item.id;

      const restoSalesTemporary = {
        ...restoSalesTemporaryOrigin,
        sales_details: restoSalesTemporaryOrigin.sales_details.map((detail) => {
          const isSpecialItem = BigInt(detail.product_id) === specialItemId;

          return {
            ...detail,
            specialItemExtras: isSpecialItem
              ? { name: detail.product_name }
              : null,
          };
        }),
      };

      const sales = await proccessSalesTransaction({
        salesTemporary: restoSalesTemporary,
        sateliteConfig: SateliteUnitConfig.resto_patio,
        transactionType: SalesTransactionTypeEnum.RESTO_PATIO_SALE,
        tx: tx,
        promoCode: validatedValues.promo_code,
      });
      salesId = sales.id;

      // Assign captain order id to sales
      await assignCaptainOrderToSale(sales.id, captainOrder.id, tx);

      // Update data paid qty on table captain order details
      await updatePaidQtyCaptainOrderDetails(sales, captainOrder.id, tx);

      // Store data to table payments
      await storePaymentData(validatedValues, sales, tx);

      // Deduct stock of product
      await deductStockFromSales({ sales, tx });
    });

    return {
      status: "success",
      message: "Berhasil melakukan pembayaran",
      url: `/pos/resto/patio/captain-order/${captainOrder.id}/sales/${salesId}/receipt`,
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

    console.error(errors);
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
      resto_sales_temporary: JSON.parse(
        formData.get("resto_sales_temporary") as string,
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

async function assignCaptainOrderToSale(
  salesId: bigint,
  captainOrderId: bigint,
  tx: DatabaseTransaction,
): Promise<void> {
  await tx
    .update(sales)
    .set({
      captain_order_id: captainOrderId,
    })
    .where(eq(sales.id, salesId));
}

async function updatePaidQtyCaptainOrderDetails(
  sales: SalesIncludeRelation,
  captainOrderId: bigint,
  tx: DatabaseTransaction,
): Promise<void> {
  for (const saleDetail of sales.salesDetails) {
    await tx
      .update(captainOrderDetails)
      .set({
        paid_qty: sql`${captainOrderDetails.paid_qty} + ${saleDetail.qty}`,
      })
      .where(
        and(
          eq(captainOrderDetails.captain_order_id, captainOrderId),
          eq(captainOrderDetails.product_id, BigInt(saleDetail.product_id)),
        ),
      );
  }
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
        credit_card_number: payment.credit_card_number,
        qris_issuer: payment.qris_issuer,
        q_voucher_codes: payment.q_voucher_codes,
      },
    });
  }
}
