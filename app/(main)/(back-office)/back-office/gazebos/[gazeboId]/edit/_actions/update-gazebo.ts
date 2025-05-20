"use server";

import { db } from "@/db";
import { gazebos } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { updateGazeboValidationSchema } from "./_libs/update-gazebo-validation-schema";

type ValidatedValues = {
  gazebo_id: number;
  status: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updateGazebo(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_GAZEBO_UPDATE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    const gazeboIdValidated = BigInt(validatedValues.gazebo_id);
    await db.transaction(async (tx) => {
      await tx
        .update(gazebos)
        .set({
          status: validatedValues.status,
        })
        .where(eq(gazebos.id, gazeboIdValidated));
    });

    const url = "/back-office/gazebos";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan perubahan data gazebo",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan perubahan data gazebo. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan perubahan data gazebo. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await updateGazeboValidationSchema.validate(
    {
      gazebo_id: formData.get("gazebo_id"),
      status: formData.get("status"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
