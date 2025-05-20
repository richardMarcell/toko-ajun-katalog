"use server";

import { db } from "@/db";
import { ipLocations, sessions } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";

const validationSchema = yup.object({
  ip_location_id: yup
    .number()
    .required("ID IP Location wajib diisi")
    .test(
      "is-ip-location-exists",
      "Lokasi IP tidak terdaftar dalam sistem",
      async function (ipLocationId) {
        const ipLocation = await db.query.ipLocations.findFirst({
          where: eq(ipLocations.id, BigInt(ipLocationId)),
        });

        if (!ipLocation) return false;

        return true;
      },
    ),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function deleteUserSession(
  prevState: any,
  ipLocationId: bigint,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_IP_LOCATION_UPDATE],
    user: user,
  });

  try {
    const validatedValues = await validationSchema.validate(
      {
        ip_location_id: ipLocationId,
      },
      {
        abortEarly: false,
      },
    );

    const ipLocationIdValidated = BigInt(validatedValues.ip_location_id);

    await db.transaction(async (tx) => {
      const ipLocation = await tx.query.ipLocations.findFirst({
        where: eq(ipLocations.id, ipLocationIdValidated),
      });

      if (ipLocation) {
        const userId = ipLocation.current_logged_in_user;
        if (userId) {
          await tx.delete(sessions).where(eq(sessions.user_id, userId));
        }

        await tx
          .update(ipLocations)
          .set({
            current_logged_in_user: null,
          })
          .where(eq(ipLocations.id, ipLocation.id));
      }
    });

    revalidatePath(`/back-office/ip-locations`);

    return {
      status: "success",
      message: "Berhasil mengeluarkan pengguna dari aplikasi",
    };
  } catch (error: any) {
    console.error(error);

    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal mengeluarkan pengguna dari aplikasi. Terjadi kesalahan pada sistem",
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
        "Gagal mengeluarkan pengguna dari aplikasi. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}
