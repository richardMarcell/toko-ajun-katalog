"use server";

import { db } from "@/db";
import { promos } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";

const validationSchema = yup.object({
  promo_id: yup
    .string()
    .required("Promo ID wajib diisi")
    .test(
      "is-promo-exists",
      "Promo tidak terdaftar dalam sistem",
      async function (promoId) {
        const promo = await db.query.promos.findFirst({
          where: eq(promos.id, BigInt(promoId)),
        });

        if (!promo) return false;

        return true;
      },
    ),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updatePromoActiveStatus(
  prevState: any,
  promoId: bigint,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_PROMO_UPDATE],
    user: user,
  });

  try {
    const validatedValues = await validationSchema.validate(
      {
        promo_id: promoId,
      },
      {
        abortEarly: false,
      },
    );

    const promoIdValidated = BigInt(validatedValues.promo_id);

    await db.transaction(async (tx) => {
      const promo = await tx.query.promos.findFirst({
        where: eq(promos.id, promoIdValidated),
      });

      if (promo) {
        await tx
          .update(promos)
          .set({
            is_active: !promo.is_active,
          })
          .where(eq(promos.id, promo.id));
      }
    });

    revalidatePath(`/back-office/promos`);

    return {
      status: "success",
      message: "Berhasil mengubah status aktif promo",
    };
  } catch (error: any) {
    console.error(error);

    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal mengubah status aktif promo. Terjadi kesalahan pada sistem",
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
        "Gagal mengubah status aktif promo. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}
