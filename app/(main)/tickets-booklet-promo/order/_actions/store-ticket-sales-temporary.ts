"use server";

import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import {
  getRecomposeSalesTemporary,
  getSalesTemporaryDiscounted,
  getSalesTemporaryWithTax,
} from "@/lib/services/sales/proccess-sales-transaction";
import { SalesTemporary } from "@/types/domains/tickets-booklet-promo/sales/general";
import authorizePromo from "../../_libs/authorize-promo";
import { validationSchema } from "./_libs/validation-schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function storeTicketSalesTemporary(
  preState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.TICKET_SALES_STORE],
    user: user,
  });

  try {
    const validatedValues = await validationSchema.validate(
      {
        customer_name: formData.get("customer_name"),
        customer_phone_number: formData.get("customer_phone_number"),
        customer_origin_id: formData.get("customer_origin_id"),
        sales_details: JSON.parse(formData.get("sales_details") as string),
        is_festive: formData.get("is_festive"),

        promo_code: formData.get("promo_code"),
        booklet_code: formData.get("booklet_code"),

        wristband_qty: formData.get("wristband_qty"),
        total_deposit: formData.get("total_deposit"),
        wristband_code_list: JSON.parse(
          formData.get("wristband_code_list") as string,
        ),

        tax_amount: formData.get("tax_amount"),
        tax_percent: formData.get("tax_percent"),
        discount_amount: formData.get("discount_amount"),
        discount_percent: formData.get("discount_percent"),

        total_gross: formData.get("total_gross"),
        total_net: formData.get("total_net"),
        grand_total: formData.get("grand_total"),
      },
      {
        abortEarly: false,
      },
    );

    const promoCode = validatedValues.promo_code;
    const bookletCode = validatedValues?.booklet_code ?? "";

    const isPromoAuthorized = await authorizePromo(promoCode, bookletCode);
    if (!isPromoAuthorized) {
      return {
        status: "error",
        message:
          "Promo tidak dapat digunakan saat ini. Periksa kembali kode dan ketersediaannya",
      };
    }

    const salesTemporary = {
      sales_details: validatedValues.sales_details.map((detail) => ({
        product_id: detail.product_id,
        price: detail.price,
        qty: detail.qty,
      })),
    };

    const hasWristband = validatedValues.wristband_qty > 0;

    const recomposeSalesTemporary =
      await getRecomposeSalesTemporary(salesTemporary);

    const salesTemporaryDiscounted = await getSalesTemporaryDiscounted(
      recomposeSalesTemporary,
      validatedValues.promo_code,
    );

    const salesTemporaryWithTax = await getSalesTemporaryWithTax(
      salesTemporaryDiscounted,
      SateliteUnitConfig.water_park_ticket.unit_business,
    );

    const totalDeposit = hasWristband ? validatedValues.total_deposit : 0;
    const grandTotal = totalDeposit + salesTemporaryWithTax.grand_total;

    const ticketSalesTemporary: SalesTemporary = {
      customer_name: validatedValues.customer_name,
      customer_phone_number: validatedValues.customer_phone_number,
      customer_origin_id: validatedValues.customer_origin_id,
      sales_details: validatedValues.sales_details,
      is_festive: validatedValues.is_festive,
      wristband_qty: hasWristband ? validatedValues.wristband_qty : 0,
      total_deposit: totalDeposit,
      wristband_code_list: hasWristband
        ? validatedValues.wristband_code_list
        : [],
      tax_percent: salesTemporaryWithTax.tax_percent,
      tax_amount: salesTemporaryWithTax.tax_amount,
      discount_amount: salesTemporaryWithTax.discount_amount,
      discount_percent: salesTemporaryWithTax.discount_percent,
      total_gross: salesTemporaryWithTax.total_gross,
      total_net: salesTemporaryWithTax.total_net,
      grand_total: grandTotal,
    };

    const query = new URLSearchParams();
    if (validatedValues.promo_code) {
      query.set("promoCode", validatedValues.promo_code);
    }
    if (validatedValues.booklet_code) {
      query.set("bookletCode", validatedValues.booklet_code);
    }

    return {
      status: "success",
      message: "Berhasil menyimpan data pemesanan tiket",
      data: ticketSalesTemporary,
      url: `/tickets-booklet-promo/sales/create${query.toString() ? `?${query.toString()}` : ""}`,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data pemesanan tiket. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan data pemesanan tiket. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}
