"use server";

import { db } from "@/db";
import { entryPassCustomers } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { updateGeneralDataValidationSchema } from "./_libs/update-general-data-validation-schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function updateEntryPassGeneralData(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [
      PermissionEnum.ENTRY_PASS_UPDATE_ALL,
      PermissionEnum.ENTRY_PASS_UPDATE_GENERAL_DATA,
    ],
    user: user,
  });

  try {
    const validatedValues = await updateGeneralDataValidationSchema.validate(
      {
        entry_pass_customer_id: formData.get("entry_pass_customer_id"),
        name: formData.get("name"),
        national_id_number: formData.get("national_id_number"),
        phone_number: formData.get("phone_number"),
      },
      {
        abortEarly: false,
      },
    );

    await db.transaction(async (tx) => {
      await tx
        .update(entryPassCustomers)
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
            entryPassCustomers.id,
            BigInt(validatedValues.entry_pass_customer_id),
          ),
        );
    });

    revalidatePath("/entry-pass");

    return {
      status: "success",
      message:
        "Berhasil melakukan perubahan data informasi pelanggan entry pass",
    };
  } catch (error: any) {
    if (!(error instanceof yup.ValidationError)) {
      console.error(error);

      return {
        status: "error",
        message:
          "Gagal melakukan perubahan data informasi pelanggan entry pass. Terjadi kesalahan pada sistem",
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
        "Gagal melakukan perubahan data informasi pelanggan entry pass. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}
