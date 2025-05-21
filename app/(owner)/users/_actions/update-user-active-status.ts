"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/server-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";

const validationSchema = yup.object({
  user_id: yup
    .string()
    .required("User ID wajib diisi")
    .test(
      "is-user-exists",
      "User tidak terdaftar dalam sistem",
      async function (userId) {
        const user = await db.query.users.findFirst({
          where: eq(users.id, BigInt(userId)),
        });

        if (!user) return false;

        return true;
      },
    ),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updateUserActiveStatus(
  prevState: any,
  userId: bigint,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.USER_UPDATE],
    user: user,
  });

  try {
    const validatedValues = await validationSchema.validate(
      {
        user_id: userId,
      },
      {
        abortEarly: false,
      },
    );

    const userIdValidated = BigInt(validatedValues.user_id);

    await db.transaction(async (tx) => {
      const user = await tx.query.users.findFirst({
        where: eq(users.id, userIdValidated),
      });

      if (user) {
        await tx
          .update(users)
          .set({
            is_active: !user.is_active,
          })
          .where(eq(users.id, user.id));
      }
    });

    revalidatePath(`/users`);

    return {
      status: "success",
      message: "Berhasil mengubah status aktif pengguna",
    };
  } catch (error: any) {
    console.error(error);

    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal mengubah status aktif pengguna. Terjadi kesalahan pada sistem",
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
        "Gagal mengubah status aktif pengguna. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}
