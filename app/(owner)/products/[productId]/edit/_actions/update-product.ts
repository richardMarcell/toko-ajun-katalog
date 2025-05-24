"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { createSlugWithTimestamp, getAbsolutePath } from "@/lib/utils";
import { Product } from "@/types/product";
import { ServerActionResponse } from "@/types/server-action";
import { eq } from "drizzle-orm";
import { existsSync, mkdirSync, unlinkSync, writeFile } from "fs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { join } from "path";
import sharp from "sharp";
import * as yup from "yup";
import { getProduct } from "../../../_repositories/get-product";
import { updateProductValidationSchema } from "./_libs/update-product-validation-schema";

type ValidatedValues = {
  product_id: number;
  name: string;
  code: string;
  description: string;
  product_category_id: number;
  price: number;
  image?: File | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updateProduct(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.PRODUCT_UPDATE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    await db.transaction(async (tx) => {
      const { product } = await getProduct({
        productId: validatedValues.product_id.toString(),
      });

      if (!product) throw new Error("Product doesn't exists");

      const image = await saveImage(validatedValues, product);

      await tx
        .update(products)
        .set({
          code: validatedValues.code,
          name: validatedValues.name,
          description: validatedValues.description,
          price: validatedValues.price.toString(),
          product_category_id: BigInt(validatedValues.product_category_id),
          image: image,
        })
        .where(eq(products.id, BigInt(validatedValues.product_id)));
    });

    const url = "/products";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan perubahan data produk",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan perubahan data produk. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan perubahan data produk. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await updateProductValidationSchema.validate(
    {
      product_id: formData.get("product_id"),
      name: formData.get("name"),
      code: formData.get("code"),
      description: formData.get("description"),
      product_category_id: formData.get("product_category_id"),
      price: formData.get("price"),
      image: formData.get("image"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

async function saveImage(
  validatedValues: ValidatedValues,
  product: Product,
): Promise<string> {
  if (!validatedValues.image) return product.image;
  if (validatedValues.image.size < 1) return product.image;

  try {
    const imageSize = 1080;
    const imageValidated = validatedValues.image;
    const bytes = await imageValidated.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const bufferResize = await sharp(buffer)
      .resize(imageSize)
      .webp({ quality: 100, lossless: false })
      .toBuffer();

    const filename = `${createSlugWithTimestamp(validatedValues.name)}.webp`;

    const basePath = "storages/products";
    const targetFolderPath = getAbsolutePath("/public/storages/products");

    if (!existsSync(targetFolderPath)) {
      mkdirSync(targetFolderPath, { recursive: true });
    }

    const oldImagePath = getAbsolutePath(`/public/${product.image}`);
    if (product.image && existsSync(oldImagePath)) {
      unlinkSync(oldImagePath);
    }

    const path = join(targetFolderPath, "/", filename);
    const uint8Array = new Uint8Array(bufferResize);
    writeFile(path, uint8Array, (error) => {
      if (error) console.error("try", error);
    });

    return `${basePath}/${filename}`;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
