"use server";

import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import {
  getRecomposeSalesTemporary,
  getSalesTemporaryWithTax,
} from "@/lib/services/sales/proccess-sales-transaction";
import { getCurrentDate } from "@/lib/utils";
import { ServerActionResponse } from "@/types/domains/server-action";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { validationSchema } from "./_libs/validation-schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function storeSwimsuitRentTemporary(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SWIMSUIT_RENT_SALES_STORE],
    user: user,
  });

  try {
    const wristbandCode = formData.get("wristband_code");
    const validatedValues = await validationSchema.validate(
      {
        ...(wristbandCode != null && {
          wristband_code: wristbandCode,
        }),
        customer_name: formData.get("customer_name"),
        customer_phone_number: formData.get("customer_phone_number"),
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
      SateliteUnitConfig.locker.unit_business,
    );

    const swimmingsuitRentTemporaryData = {
      total_gross: salesTemporaryWithTax.total_gross,
      total_net: salesTemporaryWithTax.total_net,
      grand_total: salesTemporaryWithTax.grand_total,
      discount_amount: 0,
      discount_percent: 0,
      tax_amount: salesTemporaryWithTax.tax_amount,
      tax_percent: salesTemporaryWithTax.tax_percent,
      unit_business: SateliteUnitConfig.locker.unit_business,
      sales_details: validatedValues.sales_details,
      customer_name: validatedValues.customer_name,
      customer_phone_number: validatedValues.customer_phone_number,
      created_at: getCurrentDate(),
      ...(validatedValues.wristband_code != null && {
        wristband_code: validatedValues.wristband_code,
      }),
    };

    return {
      status: "success",
      message: "Berhasil menyimpan data penyewaan baju renang",
      data: swimmingsuitRentTemporaryData,
    };
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
}
