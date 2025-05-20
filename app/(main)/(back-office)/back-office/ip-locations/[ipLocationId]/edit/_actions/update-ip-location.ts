"use server";

import { db } from "@/db";
import { ipLocations } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { updateIpLocationValidationSchema } from "./_libs/update-ip-location-validation-schema";
import PermissionDeniedError from "@/lib/exceptions/permission-denied-error";

type ValidatedValues = {
  ip_location_id: number;
  ip_address: string;
  location_desc: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updateIpLocation(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const permissionNames = [PermissionEnum.BACK_OFFICE_IP_LOCATION_UPDATE];
    const isAuthorized = await can({
      permissionNames: permissionNames,
      user: user,
    });

    if (!isAuthorized)
      throw new PermissionDeniedError({
        userId: user.id,
        userName: user.name,
        deniedPermissions: permissionNames.toString(),
      });

    const validatedValues = await validateRequest(formData);
    const ipLocationIdValidated = BigInt(validatedValues.ip_location_id);
    await db.transaction(async (tx) => {
      await tx
        .update(ipLocations)
        .set({
          ip_address: validatedValues.ip_address,
          location_desc: validatedValues.location_desc,
        })
        .where(eq(ipLocations.id, ipLocationIdValidated));
    });

    const url = "/back-office/ip-locations";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan perubahan data lokasi IP",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof PermissionDeniedError) {
      return {
        status: "error",
        message:
          "Gagal menyimpan perubahan data lokasi IP. User tidak memiliki izin untuk melakukan tindakan ini",
      };
    }

    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan perubahan data lokasi IP. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan perubahan data lokasi IP. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await updateIpLocationValidationSchema.validate(
    {
      ip_location_id: formData.get("ip_location_id"),
      ip_address: formData.get("ip_address"),
      location_desc: formData.get("location_desc"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
