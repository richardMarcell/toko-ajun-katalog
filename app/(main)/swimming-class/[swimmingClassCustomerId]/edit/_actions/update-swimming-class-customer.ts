"use server";

import { db } from "@/db";
import {
  swimmingClassCustomerHistories,
  swimmingClassCustomers,
} from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { addToDate } from "@/lib/utils";
import { and, eq, isNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { validationSchema } from "./_libs/validation-schema";
import { ServerActionResponse } from "@/types/domains/server-action";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function updateSwimmingClassCustomer(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SWIMMING_CLASS_UPDATE],
    user: user,
  });

  try {
    const validatedValues = await validationSchema.validate(
      {
        swimming_class_customer_id: formData.get("swimming_class_customer_id"),
        name: formData.get("name"),
        product_id: formData.get("product_id"),
        national_id_number: formData.get("national_id_number"),
        phone_number: formData.get("phone_number"),
        registered_at: formData.get("registered_at"),
      },
      {
        abortEarly: false,
      },
    );

    const isCustomerHasUnpaidSwimmingClass =
      await hasUnpaidSwimmingClassForCustomer(
        BigInt(validatedValues.swimming_class_customer_id),
      );

    if (isCustomerHasUnpaidSwimmingClass)
      return {
        status: "error",
        message:
          "Masih terdapat transaksi kelas renang yang belum diselesaikan",
      };

    await db.transaction(async (tx) => {
      await tx
        .update(swimmingClassCustomers)
        .set({
          name: validatedValues.name,
          phone_number: validatedValues.phone_number,
          national_id_number:
            validatedValues.national_id_number != ""
              ? validatedValues.national_id_number
              : null,
        })
        .where(
          eq(
            swimmingClassCustomers.id,
            BigInt(validatedValues.swimming_class_customer_id),
          ),
        );

      const product = await db.query.products.findFirst({
        where: (products, { eq }) =>
          eq(products.id, BigInt(validatedValues.product_id)),
        columns: {
          swimming_class_valid_for: true,
        },
      });

      await tx.insert(swimmingClassCustomerHistories).values({
        created_by: BigInt(user.id),
        product_id: BigInt(validatedValues.product_id),
        registered_at: validatedValues.registered_at,
        sc_customer_id: BigInt(validatedValues.swimming_class_customer_id),
        valid_for: product ? (product.swimming_class_valid_for ?? 0) : 0,
        valid_until: addToDate(validatedValues.registered_at, 1, "month"),
      });
    });

    revalidatePath("/swimming-class");

    return {
      status: "success",
      message: "Berhasil melakukan perubahan data pelanggan kelas renang",
    };
  } catch (error: any) {
    if (!(error instanceof yup.ValidationError)) {
      console.error(error);

      return {
        status: "error",
        message:
          "Gagal melakukan perubahan data pelanggan kelas renang. Terjadi kesalahan pada sistem",
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
        "Gagal melakukan perubahan data pelanggan kelas renang. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function hasUnpaidSwimmingClassForCustomer(
  swimmingClassCustomerId: bigint,
): Promise<boolean> {
  const result = await db
    .select({
      count: sql`COUNT(${swimmingClassCustomerHistories.id})`,
    })
    .from(swimmingClassCustomerHistories)
    .where(
      and(
        eq(
          swimmingClassCustomerHistories.sc_customer_id,
          swimmingClassCustomerId,
        ),
        isNull(swimmingClassCustomerHistories.sales_id),
      ),
    );

  const countUnpaidSwimmingClassByCustomer = Number(result[0]?.count) || 0;

  if (countUnpaidSwimmingClassByCustomer > 0) return true;
  else return false;
}
