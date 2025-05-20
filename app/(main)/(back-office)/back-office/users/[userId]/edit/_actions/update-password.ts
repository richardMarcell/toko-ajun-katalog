"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { updatePasswordValidationSchema } from "./_libs/update-password-validation-schema";

type ValidatedValues = {
  user_id: number;
  password: string;
  password_confirmation: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updatePassword(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_USER_UPDATE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    const password = await bcrypt.hash(validatedValues.password, 10);
    const userId = BigInt(validatedValues.user_id);

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          password: password,
        })
        .where(eq(users.id, userId));
    });

    revalidatePath(`/back-office/users/${userId}/edit`);

    return {
      status: "success",
      message: "Berhasil mengubah password pengguna",
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal mengubah password pengguna. Terjadi kesalahan pada sistem",
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
        "Gagal mengubah password pengguna. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await updatePasswordValidationSchema.validate(
    {
      user_id: formData.get("user_id"),
      password: formData.get("password"),
      password_confirmation: formData.get("password_confirmation"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
