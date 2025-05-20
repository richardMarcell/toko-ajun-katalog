"use server";

import { db } from "@/db";
import { lockers } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { updateLockerValidationSchema } from "./_libs/update-locker-validation-schema";

type ValidatedValues = {
  locker_id: number;
  status: string;
  wristband_code: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updateLocker(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_LOCKER_UPDATE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    const lockerIdValidated = BigInt(validatedValues.locker_id);
    await db.transaction(async (tx) => {
      await tx
        .update(lockers)
        .set({
          wristband_code: validatedValues.wristband_code,
          status: validatedValues.status,
        })
        .where(eq(lockers.id, lockerIdValidated));
    });

    const url = "/back-office/lockers";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan perubahan data loker",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan perubahan data loker. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan perubahan data loker. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await updateLockerValidationSchema.validate(
    {
      locker_id: formData.get("locker_id"),
      status: formData.get("status"),
      wristband_code: formData.get("wristband_code"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
