"use server";

import { db } from "@/db";
import { productCategories } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/server-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeProductCategoryValidationSchema } from "./_libs/store-product-category-validation-schema";

type ValidatedValues = {
  name: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function storeProductCategory(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.PRODUCT_CATEGORY_STORE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    await db.transaction(async (tx) => {
      await tx.insert(productCategories).values({
        name: validatedValues.name,
      });
    });

    const url = "/product-categories";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan data kategori produk baru",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data kategori produk baru. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan data kategori produk baru. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await storeProductCategoryValidationSchema.validate(
    {
      name: formData.get("name"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
