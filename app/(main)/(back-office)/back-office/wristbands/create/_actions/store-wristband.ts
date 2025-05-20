"use server";

import { db } from "@/db";
import { wristbands } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeWristbandValidationSchema } from "./_libs/store-wristband-validation-schema";

type ValidatedValues = {
  wristband_code: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function storeWristband(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_WRISTBAND_STORE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    await db.transaction(async (tx) => {
      await tx.insert(wristbands).values({
        code: validatedValues.wristband_code,
        status: WristbandStatusEnum.AVAILABLE,
      });
    });

    const url = "/back-office/wristbands";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan data gelang baru",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data gelang baru. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan data gelang baru. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await storeWristbandValidationSchema.validate(
    {
      wristband_code: formData.get("wristband_code"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
