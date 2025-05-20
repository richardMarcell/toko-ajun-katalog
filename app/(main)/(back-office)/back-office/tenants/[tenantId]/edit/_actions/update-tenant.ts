"use server";

import { db } from "@/db";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import PermissionDeniedError from "@/lib/exceptions/permission-denied-error";
import { products, tenants } from "@/db/schema";
import { updateTenantValidationSchema } from "./_libs/update-tenant-validation-schema";
import { eq } from "drizzle-orm";

type ValidatedValues = {
  tenant_id: number;
  name: string;
  image: string;
  ip_address: string;
  is_required_tax: boolean;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updateTenant(
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

    const tenantId = BigInt(validatedValues.tenant_id);

    const tenantProducts = await db.query.products.findMany({
      where: eq(products.fc_tenant_id, tenantId),
    });

    await db.transaction(async (tx) => {
      await tx
        .update(tenants)
        .set({
          name: validatedValues.name,
          image: validatedValues.image,
          ip_address: validatedValues.ip_address,
          is_required_tax: validatedValues.is_required_tax,
        })
        .where(eq(tenants.id, tenantId));

      if (tenantProducts.length > 0) {
        await tx
          .update(products)
          .set({
            is_required_tax: validatedValues.is_required_tax,
          })
          .where(eq(products.fc_tenant_id, tenantId));
      }
    });

    const url = "/back-office/tenants";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan perubahan data tenant",
      url,
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof PermissionDeniedError) {
      return {
        status: "error",
        message:
          "Gagal menyimpan perubahan data tenant. User tidak memiliki izin untuk melakukan tindakan ini",
      };
    }

    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan perubahan data tenant. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan perubahan data tenant. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const isRequiredTax = formData.get("is_required_tax") ? true : false;

  const validatedValues = await updateTenantValidationSchema.validate(
    {
      tenant_id: formData.get("tenant_id"),
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
