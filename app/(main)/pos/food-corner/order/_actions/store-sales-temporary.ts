"use server";

import { db } from "@/db";
import { salesTemporary } from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import {
  getRecomposeSalesTemporary,
  getSalesTemporaryWithTax,
} from "@/lib/services/sales/proccess-sales-transaction";
import { ServerActionResponse } from "@/types/domains/server-action";
import { redirect, RedirectType } from "next/navigation";
import * as yup from "yup";
import { validationSchema } from "./_libs/validation-schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function storeSalesTemporary(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.FOOD_CORNER_SALES_STORE],
    user: user,
  });

  try {
    const validatedValues = await validationSchema.validate(
      {
        table_number: formData.get("table_number"),
        order_type: formData.get("order_type"),
        sales_details: JSON.parse(formData.get("sales_details") as string),
      },
      {
        abortEarly: false,
      },
    );

    const recomposeSalesTemporary = await getRecomposeSalesTemporary({
      sales_details: validatedValues.sales_details,
    });

    const salesTemporaryWithTax = await getSalesTemporaryWithTax(
      recomposeSalesTemporary,
      SateliteUnitConfig.food_corner.unit_business,
    );

    await db.transaction(async (tx) => {
      const salesTemporaryData = {
        total_gross: salesTemporaryWithTax.total_gross,
        total_net: salesTemporaryWithTax.total_net,
        grand_total: salesTemporaryWithTax.grand_total,
        discount_amount: 0,
        discount_percent: 0,
        tax_amount: salesTemporaryWithTax.tax_amount,
        tax_percent: salesTemporaryWithTax.tax_percent,
        unit_business: SateliteUnitConfig.food_corner.unit_business,
        sales_details: salesTemporaryWithTax.sales_details,
        table_number:
          validatedValues.table_number == ""
            ? null
            : validatedValues.table_number,
        order_type: validatedValues.order_type,
      };

      await tx
        .insert(salesTemporary)
        .values({
          unit_business: SateliteUnitConfig.food_corner.unit_business,
          user_id: BigInt(user.id),
          value: salesTemporaryData,
        })
        .onDuplicateKeyUpdate({
          set: {
            unit_business: SateliteUnitConfig.food_corner.unit_business,
            user_id: BigInt(user.id),
            value: salesTemporaryData,
          },
        });
    });
  } catch (error: any) {
    if (!(error instanceof yup.ValidationError)) {
      console.error(error);

      return {
        status: "error",
        message: "Gagal menambahkan pesanan. Terjadi kesalahan pada sistem",
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
        "Gagal menambahkan pesanan. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }

  redirect("/pos/food-corner/sales/create", RedirectType.push);
}
