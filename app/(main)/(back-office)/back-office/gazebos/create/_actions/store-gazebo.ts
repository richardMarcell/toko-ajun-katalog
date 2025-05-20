"use server";

import { db } from "@/db";
import { gazebos } from "@/db/schema";
import { GazeboTypeEnum, getGazeboProductId } from "@/lib/enums/GazeboTypeEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeGazeboValidationSchema } from "./_libs/store-gazebo-validation-schema";

type ValidatedValues = {
  label: string;
  type: string;
  status: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function storeGazebo(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_GAZEBO_STORE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    const gazeboType = validatedValues.type as GazeboTypeEnum;
    const productId = getGazeboProductId(gazeboType);
    if (!productId)
      throw new Error(
        `Product ID is not registered for gazebo type "${gazeboType}".`,
      );

    await db.transaction(async (tx) => {
      await tx.insert(gazebos).values({
        product_id: productId,
        label: validatedValues.label,
        status: validatedValues.status,
        type: gazeboType,
      });
    });

    const url = "/back-office/gazebos";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan data gazebo baru",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data gazebo baru. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan data gazebo baru. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await storeGazeboValidationSchema.validate(
    {
      label: formData.get("label"),
      type: formData.get("type"),
      status: formData.get("status"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
