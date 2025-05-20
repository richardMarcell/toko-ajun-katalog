"use server";

import { db } from "@/db";
import { userHasRoles, users } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { DatabaseTransaction } from "@/types/db-transaction";
import { ServerActionResponse } from "@/types/domains/server-action";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { updateUserValidationSchema } from "./_libs/update-user-validation-schema";
import { revalidatePath } from "next/cache";

type ValidatedValues = {
  user_id: number;
  name: string;
  email: string;
  username: string;
  role_ids: number[];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updateUser(
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

    await db.transaction(async (tx) => {
      await updateUserData(validatedValues, tx);

      const roleIds = validatedValues.role_ids;
      await sycnUserHasRole(validatedValues, roleIds, tx);
    });

    const url = "/back-office/users";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan perubahan data pengguna",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan perubahan data pengguna. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan perubahan data pengguna. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await updateUserValidationSchema.validate(
    {
      user_id: formData.get("user_id"),
      name: formData.get("name"),
      email: formData.get("email"),
      username: formData.get("username"),
      role_ids: JSON.parse(formData.get("role_ids") as string),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

async function updateUserData(
  validatedValues: ValidatedValues,
  tx: DatabaseTransaction,
): Promise<void> {
  const userId = BigInt(validatedValues.user_id);
  await tx
    .update(users)
    .set({
      email: validatedValues.email,
      name: validatedValues.name,
      username: validatedValues.username,
    })
    .where(eq(users.id, userId));
}

async function sycnUserHasRole(
  validatedValues: ValidatedValues,
  roleIds: number[],
  tx: DatabaseTransaction,
) {
  const userId = BigInt(validatedValues.user_id);
  await tx.delete(userHasRoles).where(eq(userHasRoles.user_id, userId));

  await tx.insert(userHasRoles).values(
    roleIds.map((roleId) => ({
      user_id: userId,
      role_id: BigInt(roleId),
    })),
  );
}
