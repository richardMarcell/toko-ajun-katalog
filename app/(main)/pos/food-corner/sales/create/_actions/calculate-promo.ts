"use server";

import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import {
  getRecomposeSalesTemporary,
  getSalesTemporaryDiscounted,
  getSalesTemporaryWithTax,
} from "@/lib/services/sales/proccess-sales-transaction";
import { getValidPromo } from "@/repositories/domain/general/get-valid-promo";
import { ServerActionResponse } from "@/types/domains/server-action";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { calculatePromoValidationSchema } from "./_libs/calculate-promo-validation-schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function calculatePromo(
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  try {
    const validatedValues = await calculatePromoValidationSchema.validate(
      {
        promo_code: formData.get("promo_code"),
        sales_temporary: JSON.parse(formData.get("sales_temporary") as string),
      },
      {
        abortEarly: false,
      },
    );

    const { promo } = await getValidPromo(validatedValues.promo_code);

    if (!promo) {
      return {
        status: "error",
        message:
          "Kode promo yang dimasukkan tidak valid atau sudah tidak berlaku, silahkan masukkan kode promo yang lain",
      };
    }

    // Recompose sales data by retrieving the latest product prices and tax requirements from the database
    const recomposeSalesTemporary = await getRecomposeSalesTemporary(
      validatedValues.sales_temporary,
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

    return {
      status: "success",
      message: "Berhasil menerapkan promo",
      data: salesTemporaryWithTax,
    };
  } catch (error: any) {
    if (!(error instanceof yup.ValidationError)) {
      console.error(error);

      return {
        status: "error",
        message: "Gagal menerapkan promo. Terjadi kesalahan pada sistem",
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
        "Gagal menerapkan promo. Silahkan periksa inputan yang Anda masukkan.",
      errors: errors,
    };
  }
}
