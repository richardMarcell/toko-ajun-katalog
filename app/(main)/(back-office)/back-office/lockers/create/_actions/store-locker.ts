"use server";

import { db } from "@/db";
import { lockers } from "@/db/schema";
import { getLockerProductId, LockerTypeEnum } from "@/lib/enums/LockerTypeEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeLockerValidationSchema } from "./_libs/store-locker-validation-schema";

type ValidatedValues = {
  label: string;
  type: string;
  status: string;
  wristband_code: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function storeLocker(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_LOCKER_STORE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    const lockerType = validatedValues.type as LockerTypeEnum;
    const productId = getLockerProductId(lockerType);
    if (!productId)
      throw new Error(
        `Product ID is not registered for locker type "${lockerType}".`,
      );

    await db.transaction(async (tx) => {
      await tx.insert(lockers).values({
        product_id: productId,
        wristband_code: validatedValues.wristband_code,
        label: validatedValues.label,
        status: validatedValues.status,
        type: lockerType,
      });
    });

    const url = "/back-office/lockers";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan data loker baru",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data loker baru. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan data loker baru. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await storeLockerValidationSchema.validate(
    {
      label: formData.get("label"),
      type: formData.get("type"),
      status: formData.get("status"),
      wristband_code: formData.get("wristband_code"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
