"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { RoleEnum } from "@/db/seeders/datas/default-roles";
import { assignRole } from "@/lib/services/permissions/assign-role";
import { ServerActionResponse } from "@/types/server-action";
import bcrypt from "bcrypt";
import * as yup from "yup";
import { registerValidationSchema } from "./_libs/register-validation-schema";

type ValidatedValues = {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function register(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const validatedValues = await validateRequest(formData);

    await db.transaction(async (tx) => {
      const password = await bcrypt.hash(validatedValues.password, 10);
      const user = await tx
        .insert(users)
        .values({
          email: validatedValues.email,
          name: validatedValues.name,
          username: validatedValues.username,
          is_active: true,
          password: password,
        })
        .$returningId();

      const userId = user[0].id;

      assignRole({ userId, roleNames: [RoleEnum.CUSTOMER] });
    });

    return {
      status: "success",
      message: "Berhasil melakukan pendaftaran pengguna baru",
      url: "/auth/login",
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal melakukan pendaftaran pengguna baru. Terjadi kesalahan pada sistem",
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
        "Gagal melakukan pendaftaran pengguna baru. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await registerValidationSchema.validate(
    {
      name: formData.get("name"),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      password_confirmation: formData.get("password_confirmation"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
