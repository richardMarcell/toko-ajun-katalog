"use server";

import { db } from "@/db";
import {
  swimmingClassCustomerHistories,
  swimmingClassCustomers,
} from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { validationSchema } from "./_libs/validation-schema";
import { revalidatePath } from "next/cache";
import { addToDate } from "@/lib/utils";
import { ServerActionResponse } from "@/types/domains/server-action";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function storeSwimmingClassCustomer(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SWIMMING_CLASS_STORE],
    user: user,
  });

  try {
    const validatedValues = await validationSchema.validate(
      {
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

    await db.transaction(async (tx) => {
      const swimmingClassCustomerCreated = await tx
        .insert(swimmingClassCustomers)
        .values({
          name: validatedValues.name,
          phone_number: validatedValues.phone_number,
          national_id_number:
            validatedValues.national_id_number != ""
              ? validatedValues.national_id_number
              : null,
        })
        .$returningId();

      const swimmingClassCustomerId = swimmingClassCustomerCreated[0].id;

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
        sc_customer_id: swimmingClassCustomerId,
        valid_for: product ? (product.swimming_class_valid_for ?? 0) : 0,
        valid_until: addToDate(validatedValues.registered_at, 1, "month"),
      });
    });

    revalidatePath("/swimming-class");

    return {
      status: "success",
      message: "Berhasil melakukan pendaftaran pelanggan kelas renang baru",
    };
  } catch (error: any) {
    if (!(error instanceof yup.ValidationError)) {
      console.error(error);

      return {
        status: "error",
        message:
          "Gagal melakukan pendaftaran kelas renang. Terjadi kesalahan pada sistem",
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
        "Gagal melakukan pendaftaran pelanggan kelas renang baru. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}
