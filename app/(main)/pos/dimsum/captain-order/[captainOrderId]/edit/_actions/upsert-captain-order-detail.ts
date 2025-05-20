"use server";

import { db } from "@/db";
import { captainOrderDetails, captainOrders, products } from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { calculateSalesSummary } from "@/lib/services/sales/calculate-sales-summary";
import { getTaxPercent } from "@/lib/services/sales/get-tax-percent";
import { DatabaseTransaction } from "@/types/db-transaction";
import { ServerActionResponse } from "@/types/domains/server-action";
import { Product } from "@/types/product";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { upsertCaptainOrderDetailValidationSchema } from "./_libs/upsert-captain-order-detail-validation-schema";
import { getCaptainOrder } from "../../../../_repositories/get-captain-order";

type ValidatedValues = {
  note?: string | null | undefined;
  captain_order_detail_id?: number | null | undefined;
  captain_order_id: number;
  qty: number;
  product_id: number;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function upsertCaptainOrderDetail(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.DIMSUM_CAPTAIN_ORDER_UPDATE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    const product = await getProduct(BigInt(validatedValues.product_id));
    const captainOrderId = BigInt(validatedValues.captain_order_id);

    const { captainOrder } = await getCaptainOrder(captainOrderId.toString());

    if (!captainOrder) {
      return {
        status: "error",
        message:
          "Tidak dapat melanjutkan proses. Captain order tidak terdaftar dalam sistem",
      };
    }

    if (captainOrder.is_closed) {
      return {
        status: "error",
        message:
          "Tidak dapat melanjutkan proses. Transaksi captain order ini sudah di close.",
      };
    }

    if (product) {
      const captainOrderDetailId = validatedValues.captain_order_detail_id;

      await db.transaction(async (tx) => {
        if (!captainOrderDetailId) {
          await storeCaptainOrderDetail(validatedValues, tx, product);
        } else {
          if (validatedValues.qty < 1) {
            await destroyCaptainOrderDetail(BigInt(captainOrderDetailId), tx);
          } else {
            await updateCaptainOrderDetail(
              validatedValues,
              BigInt(captainOrderDetailId),
              tx,
            );
          }
        }
      });
      await updateCaptainOrder(captainOrderId);
    }

    revalidatePath(`/pos/dimsum/captain-order/${captainOrderId}/edit`);

    return {
      status: "success",
      message: "Menu berhasil ditambahkan atau diperbarui dalam pesanan",
    };
  } catch (error: any) {
    if (!(error instanceof yup.ValidationError)) {
      console.error(error);

      return {
        status: "error",
        message:
          "Gagal melakukan pemesanan menu. Terjadi kesalahan pada sistem",
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
        "Gagal melakukan pemesanan menu. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData) {
  const validatedValues =
    await upsertCaptainOrderDetailValidationSchema.validate(
      {
        captain_order_detail_id: formData.get("captain_order_detail_id"),
        captain_order_id: formData.get("captain_order_id"),
        product_id: formData.get("product_id"),
        qty: formData.get("qty"),
        note: formData.get("note"),
        authorization_code: formData.get("authorization_code"),
      },
      {
        abortEarly: false,
      },
    );

  return validatedValues;
}

async function storeCaptainOrderDetail(
  validatedValues: ValidatedValues,
  tx: DatabaseTransaction,
  product: Product,
): Promise<void> {
  const captainOrderId = BigInt(validatedValues.captain_order_id);
  const subtotal = Number(product.price) * validatedValues.qty;

  await tx.insert(captainOrderDetails).values({
    captain_order_id: captainOrderId,
    product_id: product.id,
    price: product.price,
    qty: validatedValues.qty,
    subtotal: subtotal.toString(),
    warehouse_id: SateliteUnitConfig.dimsum.warehouse_id,
    note: validatedValues.note,
    paid_qty: 0,
  });
}

async function destroyCaptainOrderDetail(
  captainOrderDetailId: bigint,
  tx: DatabaseTransaction,
): Promise<void> {
  await tx
    .delete(captainOrderDetails)
    .where(eq(captainOrderDetails.id, captainOrderDetailId));
}

async function updateCaptainOrderDetail(
  validatedValues: ValidatedValues,
  captainOrderDetailId: bigint,
  tx: DatabaseTransaction,
): Promise<void> {
  await tx
    .update(captainOrderDetails)
    .set({
      qty: validatedValues.qty,
      subtotal: sql`${captainOrderDetails.price} * ${validatedValues.qty}`,
      note: validatedValues.note,
    })
    .where(eq(captainOrderDetails.id, captainOrderDetailId));
}

async function getProduct(productId: bigint): Promise<Product | null> {
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!product) return null;

  return product;
}

async function updateCaptainOrder(captainOrderId: bigint): Promise<void> {
  const { captainOrder } = await getCaptainOrder(captainOrderId.toString());
  if (!captainOrder) throw new Error("Captain order doesn't exists");

  const taxPercent = await getTaxPercent(UnitBusinessSateliteQubuEnum.DIMSUM);
  const orderSummary = calculateSalesSummary({
    discountAmount: 0,
    salesDetails: captainOrder.captainOrderDetails.map((detail) => ({
      price: Number(detail.price),
      qty: detail.qty,
    })),
    taxPercent: taxPercent,
  });

  await db.transaction(async (tx) => {
    await tx
      .update(captainOrders)
      .set({
        discount_amount: "0",
        discount_percent: 0,
        tax_amount: orderSummary.tax_amount.toString(),
        tax_percent: taxPercent,
        total_gross: orderSummary.total_gross.toString(),
        total_net: orderSummary.total_net.toString(),
        grand_total: orderSummary.grand_total.toString(),
      })
      .where(eq(captainOrders.id, captainOrder.id));
  });
}
