"use server";

import { db } from "@/db";
import { roles } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeRoleValidationSchema } from "./_libs/store-role-validation-schema";
import { revalidatePath } from "next/cache";
import PermissionDeniedError from "@/lib/exceptions/permission-denied-error";

type ValidatedValues = {
  name: string;
  description: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function storeRole(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const permissionNames = [PermissionEnum.BACK_OFFICE_ROLE_STORE];
    const isAuthorized = await can({
      permissionNames: permissionNames,
      user: user,
    });

    if (!isAuthorized)
      throw new PermissionDeniedError({
        userId: user.id,
        userName: user.name,
        deniedPermissions: permissionNames.toString(),
      });

    const validatedValues = await validateRequest(formData);

    let roleId: bigint | null = null;
    await db.transaction(async (tx) => {
      const role = await tx
        .insert(roles)
        .values({
          name: validatedValues.name,
          description: validatedValues.description,
        })
        .$returningId();

      roleId = role[0].id;
    });

    const url = `/back-office/roles/${roleId}/edit`;

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan data role baru",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof PermissionDeniedError) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data role baru. User tidak memiliki izin untuk melakukan tindakan ini",
      };
    }

    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data role baru. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan data role baru. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await storeRoleValidationSchema.validate(
    {
      name: formData.get("name"),
      description: formData.get("description"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
