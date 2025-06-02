"use server";

import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/server-action";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { updateSalesValidationSchema } from "./_libs/update-sales-validation-schema";
import { getSale } from "../../../_repositories/get-sale";
import { SalesStatusEnum } from "@/lib/enums/SalesStatusEnum";
import { db } from "@/db";
import { sales } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function updateSales(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SALES_UPDATE],
    user: user,
  });

  try {
    const validatedValues = await updateSalesValidationSchema.validate(
      {
        sales_id: formData.get("sales_id"),
        status: formData.get("status"),
      },
      {
        abortEarly: false,
      },
    );

    const { sale } = await getSale({
      salesId: validatedValues.sales_id.toString(),
    });

    if (!sale) {
      return {
        status: "error",
        message: "Penjualan tidak terdaftar dalam sistem",
      };
    }

    if (sale.status === SalesStatusEnum.CLOSED) {
      return {
        status: "error",
        message: "Tidak bisa melanjutkan proses, penjualan sudah di close",
      };
    }

    await db.transaction(async (tx) => {
      await tx
        .update(sales)
        .set({
          status: validatedValues.status,
        })
        .where(eq(sales.id, BigInt(validatedValues.sales_id)));
    });

    const url = "/sales";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil melakukan perubahan status penjualan",
      url: url,
    };
  } catch (error: any) {
    if (!(error instanceof yup.ValidationError)) {
      console.error(error);

      return {
        status: "error",
        message:
          "Gagal melakukan perubahan status penjualan. Terjadi kesalahan pada sistem",
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
        "Gagal melakukan perubahan status penjualan. Silahkan periksa inputan yang Anda masukkan.",
      errors: errors,
    };
  }
}
