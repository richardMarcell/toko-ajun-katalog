"use server";

import { db } from "@/db";
import { entryPassCustomerHistories, entryPassCustomers } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { validationSchema } from "./_libs/validation-schema";
import { addToDate } from "@/lib/utils";
import { ServerActionResponse } from "@/types/domains/server-action";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function storeEntryPassCustomer(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.ENTRY_PASS_STORE],
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
      const entryPassCustomerCreated = await tx
        .insert(entryPassCustomers)
        .values({
          name: validatedValues.name,
          phone_number: validatedValues.phone_number,
          national_id_number:
            validatedValues.national_id_number != ""
              ? validatedValues.national_id_number
              : null,
        })
        .$returningId();

      const entryPassCustomerId = entryPassCustomerCreated[0].id;

      const product = await db.query.products.findFirst({
        where: (products, { eq }) =>
          eq(products.id, BigInt(validatedValues.product_id)),
        columns: {
          ep_valid_term: true,
        },
      });

      await tx.insert(entryPassCustomerHistories).values({
        created_by: BigInt(user.id),
        product_id: BigInt(validatedValues.product_id),
        registered_at: validatedValues.registered_at,
        ep_customer_id: entryPassCustomerId,
        valid_until: addToDate(
          validatedValues.registered_at,
          product?.ep_valid_term ?? 0,
          "day",
        ),
      });
    });

    revalidatePath("/entry-pass");

    return {
      status: "success",
      message: "Berhasil melakukan pendaftaran pelanggan entry pass baru",
    };
  } catch (error: any) {
    if (!(error instanceof yup.ValidationError)) {
      console.error(error);

      return {
        status: "error",
        message:
          "Gagal melakukan pendaftaran pelanggan entry pass baru. Terjadi kesalahan pada sistem",
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
        "Gagal melakukan pendaftaran pelanggan entry pass baru. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}
