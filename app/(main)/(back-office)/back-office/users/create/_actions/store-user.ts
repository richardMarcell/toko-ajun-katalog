"use server";

import { db } from "@/db";
import { userHasRoles, users } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeUserValidationSchema } from "./_libs/store-user-validation-schema";
import { DatabaseTransaction } from "@/types/db-transaction";
import { revalidatePath } from "next/cache";

type ValidatedValues = {
  name: string;
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
  role_ids: number[];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function storeUser(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_USER_STORE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    await db.transaction(async (tx) => {
      const userId = await storeDataUser(validatedValues, tx);

      const roleIds = validatedValues.role_ids;
      await storeUserHasRole(roleIds, userId, tx);
    });

    const url = "/back-office/users";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan data pengguna baru",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data pengguna baru. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan data pengguna baru. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await storeUserValidationSchema.validate(
    {
      name: formData.get("name"),
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
      password_confirmation: formData.get("password_confirmation"),
      role_ids: JSON.parse(formData.get("role_ids") as string),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

async function storeDataUser(
  validatedValues: ValidatedValues,
  tx: DatabaseTransaction,
): Promise<bigint> {
  const password = await bcrypt.hash(validatedValues.password, 10);

  const userCreated = await tx
    .insert(users)
    .values({
      email: validatedValues.email,
      name: validatedValues.name,
      username: validatedValues.username,
      password: password,
    })
    .$returningId();

  const userId = userCreated[0].id;

  return userId;
}

async function storeUserHasRole(
  roleIds: number[],
  userId: bigint,
  tx: DatabaseTransaction,
): Promise<void> {
  await tx.insert(userHasRoles).values(
    roleIds.map((roleId) => ({
      role_id: BigInt(roleId),
      user_id: userId,
    })),
  );
}
