"use server";

import { getCaptainOrder } from "@/app/(main)/pos/resto/_repositories/get-captain-order";
import { db } from "@/db";
import { captainOrderDetails, captainOrders } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { calculateSalesSummary } from "@/lib/services/sales/calculate-sales-summary";
import { getTaxPercent } from "@/lib/services/sales/get-tax-percent";
import { ServerActionResponse } from "@/types/domains/server-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeSpecialItemValidationSchema } from "./_libs/store-special-item-validation-schema";
import { ProductConfig } from "@/lib/config/product-config";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function storeSpecialItem(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_UPDATE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

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

    await db.transaction(async (tx) => {
      const subtotal = validatedValues.qty * validatedValues.price;
      await tx.insert(captainOrderDetails).values({
        captain_order_id: captainOrderId,
        product_id: ProductConfig.special_item.id,
        warehouse_id: SateliteUnitConfig.resto_patio.warehouse_id,
        qty: validatedValues.qty,
        price: validatedValues.price.toString(),
        note: validatedValues.note,
        subtotal: subtotal.toString(),
        paid_qty: 0,
        extras: {
          name: validatedValues.name,
        },
      });
    });
    await updateCaptainOrder(captainOrderId);

    revalidatePath(`/pos/resto/patio/captain-order/${captainOrderId}/edit`);

    return {
      status: "success",
      message:
        "Special item berhasil ditambahkan atau diperbarui dalam pesanan",
    };
  } catch (error: any) {
    if (!(error instanceof yup.ValidationError)) {
      console.error(error);

      return {
        status: "error",
        message:
          "Gagal melakukan penambahan special item. Terjadi kesalahan pada sistem",
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
        "Gagal melakukan penambahan special item. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData) {
  const validatedValues = await storeSpecialItemValidationSchema.validate(
    {
      captain_order_id: formData.get("captain_order_id"),
      name: formData.get("name"),
      price: formData.get("price"),
      qty: formData.get("qty"),
      note: formData.get("note"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

async function updateCaptainOrder(captainOrderId: bigint): Promise<void> {
  const { captainOrder } = await getCaptainOrder(captainOrderId.toString());
  if (!captainOrder) throw new Error("Captain order doesn't exists");

  const taxPercent = await getTaxPercent(
    UnitBusinessSateliteQubuEnum.RESTO_PATIO,
  );
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
