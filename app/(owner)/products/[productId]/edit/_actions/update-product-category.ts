"use server";

import { db } from "@/db";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { updateProductCategoryValidationSchema } from "./_libs/update-product-category-validation-schema";
import { productCategories } from "@/db/schema";
import { ServerActionResponse } from "@/types/server-action";

type ValidatedValues = {
  product_category_id: number;
  name: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updateProductCategory(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.PRODUCT_CATEGORY_UPDATE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    await db.transaction(async (tx) => {
      await tx
        .update(productCategories)
        .set({
          name: validatedValues.name,
        })
        .where(
          eq(productCategories.id, BigInt(validatedValues.product_category_id)),
        );
    });

    const url = "/product-categories";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan perubahan data kategori produk",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan perubahan data kategori produk. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan perubahan data kategori produk. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await updateProductCategoryValidationSchema.validate(
    {
      product_category_id: formData.get("product_category_id"),
      name: formData.get("name"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
