"use server";

import { db } from "@/db";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { updateWristbandValidationSchema } from "./_libs/update-wristband-validation-schema";
import { wristbands } from "@/db/schema";
import { eq } from "drizzle-orm";

type ValidatedValues = {
  wristband_code: string;
  status: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updateWristband(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_WRISTBAND_UPDATE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    await db.transaction(async (tx) => {
      await tx
        .update(wristbands)
        .set({
          status: validatedValues.status,
        })
        .where(eq(wristbands.code, validatedValues.wristband_code));
    });

    const url = "/back-office/wristbands";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan perubahan data gelang",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan perubahan data gelang. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan perubahan data gelang. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await updateWristbandValidationSchema.validate(
    {
      wristband_code: formData.get("wristband_code"),
      status: formData.get("status"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
