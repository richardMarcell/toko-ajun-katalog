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
import { getCaptainOrder } from "../../../../_repositories/get-captain-order";
import { storeDimsumSalesTemporaryValidationSchema } from "./_libs/store-dimsum-sales-temporary-validation-schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function storeDimsumSalesTemporary(
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
    const captainOrderIdValidated = validatedValues.captain_order_id.toString();

    const { captainOrder } = await getCaptainOrder(captainOrderIdValidated);
    if (!captainOrder) {
      return {
        status: "error",
        message:
          "Tidak dapat melanjutkan proses. Captain order tidak terdaftar dalam sistem",
      };
    }

    if (captainOrder.captainOrderDetails.length === 0) {
      return {
        status: "error",
        message:
          "Tidak dapat melanjutkan proses. Belum terdapat menu yang dipesan oleh pelanggan.",
      };
    }

    if (!captainOrder.is_closed) {
      return {
        status: "error",
        message:
          "Tidak dapat melanjutkan proses. Transaksi captain order belum di close.",
      };
    }
    const recomposeSalesTemporary = await getRecomposeSalesTemporary({
      sales_details: validatedValues.sales_details,
    });

    const salesTemporaryWithTax = await getSalesTemporaryWithTax(
      recomposeSalesTemporary,
      SateliteUnitConfig.dimsum.unit_business,
    );

    const salesTemporary = {
      captain_order_id: validatedValues.captain_order_id,
      sales_details: salesTemporaryWithTax.sales_details,
      promo_code: validatedValues.promo_code,

      discount_amount: 0,
      discount_percent: 0,
      tax_amount: salesTemporaryWithTax.tax_amount,
      tax_percent: salesTemporaryWithTax.tax_percent,
      total_gross: salesTemporaryWithTax.total_gross,
      total_net: salesTemporaryWithTax.total_net,
      grand_total: salesTemporaryWithTax.grand_total,
      created_at: getCurrentDate(),
    };

    return {
      status: "success",
      message: "Berhasil melakukan penambahan item pada tagihan",
      data: salesTemporary,
      url: `/pos/dimsum/captain-order/${validatedValues.captain_order_id}/sales/create`,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal melakukan penambahan item pada tagihan. Terjadi kesalahan pada sistem",
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
        "Gagal melakukan penambahan item pada tagihan. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData) {
  const validatedValues =
    await storeDimsumSalesTemporaryValidationSchema.validate(
      {
        captain_order_id: formData.get("captain_order_id"),
        promo_code: formData.get("promo_code"),
        sales_details: JSON.parse(formData.get("sales_details") as string),
      },
      {
        abortEarly: false,
      },
    );

  return validatedValues;
}
