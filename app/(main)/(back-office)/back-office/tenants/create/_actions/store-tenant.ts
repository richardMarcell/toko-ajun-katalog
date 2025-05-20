"use server";

import { db } from "@/db";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeTenantValidationSchema } from "./_libs/store-tenant-validation-schema";
import PermissionDeniedError from "@/lib/exceptions/permission-denied-error";
import { tenants } from "@/db/schema";

type ValidatedValues = {
  name: string;
  image: string;
  ip_address: string;
  is_required_tax: boolean;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function storeTenant(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const permissionNames = [PermissionEnum.BACK_OFFICE_TENANT_STORE];

    const isAuthorized = await can({
      permissionNames: permissionNames,
      user: user,
      isRedirectToForbiddenPage: false,
    });

    if (!isAuthorized)
      throw new PermissionDeniedError({
        userId: user.id,
        userName: user.name,
        deniedPermissions: permissionNames.toString(),
      });
    const validatedValues = await validateRequest(formData);

    await db.transaction(async (tx) => {
      await tx.insert(tenants).values({
        name: validatedValues.name,
        image: validatedValues.image,
        ip_address: validatedValues.ip_address,
        is_required_tax: validatedValues.is_required_tax,
      });
    });

    const url = "/back-office/tenants";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan data tenant baru",
      url,
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof PermissionDeniedError) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data tenant baru. User tidak memiliki izin untuk melakukan tindakan ini",
      };
    }

    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data tenant baru. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan data tenant baru. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const isRequiredTax = formData.get("is_required_tax") ? true : false;

  const validatedValues = await storeTenantValidationSchema.validate(
    {
      name: formData.get("name"),
      // TODO: change the static file to read uploaded uploaded image
      // image: formData.get("image"),
      image: "/storage/pos/food-corner/tenant.webp",
      ip_address: formData.get("ip_address"),
      is_required_tax: isRequiredTax,
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
