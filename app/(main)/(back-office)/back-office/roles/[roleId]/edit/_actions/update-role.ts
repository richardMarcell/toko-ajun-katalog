"use server";

import { db } from "@/db";
import { roles } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { updateRoleValidationSchema } from "./_libs/update-role-validation-schema";
import { revalidatePath } from "next/cache";
import PermissionDeniedError from "@/lib/exceptions/permission-denied-error";
import { eq } from "drizzle-orm";

type ValidatedValues = {
  role_id: number;
  name: string;
  description: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updateRole(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const permissionNames = [PermissionEnum.BACK_OFFICE_ROLE_UPDATE];
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

    await db.transaction(async (tx) => {
      await tx
        .update(roles)
        .set({
          name: validatedValues.name,
          description: validatedValues.description,
        })
        .where(eq(roles.id, BigInt(validatedValues.role_id)));
    });

    const url = "/back-office/roles";

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
          "Gagal menyimpan perubahan data role. User tidak memiliki izin untuk melakukan tindakan ini",
      };
    }

    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan perubahan data role. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan perubahan data role. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await updateRoleValidationSchema.validate(
    {
      role_id: formData.get("role_id"),
      name: formData.get("name"),
      description: formData.get("description"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
