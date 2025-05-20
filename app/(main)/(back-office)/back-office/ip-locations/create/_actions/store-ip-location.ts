"use server";

import { db } from "@/db";
import { ipLocations } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeIpLocationValidationSchema } from "./_libs/store-ip-location-validation-schema";

type ValidatedValues = {
  ip_address: string;
  location_desc: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function storeIpLocation(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_IP_LOCATION_STORE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    let ipLocationId: bigint | null = null;
    await db.transaction(async (tx) => {
      const ipLocation = await tx
        .insert(ipLocations)
        .values({
          ip_address: validatedValues.ip_address,
          location_desc: validatedValues.location_desc,
        })
        .$returningId();

      ipLocationId = ipLocation[0].id;
    });

    const url = `/back-office/ip-locations/${ipLocationId}/edit`;

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan data lokasi IP baru",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data lokasi IP baru. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan data lokasi IP baru. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await storeIpLocationValidationSchema.validate(
    {
      ip_address: formData.get("ip_address"),
      location_desc: formData.get("location_desc"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
