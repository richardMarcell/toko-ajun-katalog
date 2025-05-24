"use server";

import { db } from "@/db";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { createSlugWithTimestamp, getAbsolutePath } from "@/lib/utils";
import { ServerActionResponse } from "@/types/server-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { existsSync, mkdirSync, writeFile } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import * as yup from "yup";
import { storeProductValidationSchema } from "./_libs/store-product-validation-schema";
import { products } from "@/db/schema";

type ValidatedValues = {
  name: string;
  code: string;
  description: string;
  product_category_id: number;
  price: number;
  image: File;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function storeProduct(
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
    console.log(validatedValues);

    await db.transaction(async (tx) => {
      const imagePath = await saveImage(validatedValues);

      await tx.insert(products).values({
        code: validatedValues.code,
        description: validatedValues.description,
        image: imagePath,
        name: validatedValues.name,
        price: validatedValues.price.toString(),
        product_category_id: BigInt(validatedValues.product_category_id),
      });
    });

    const url = "/products";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan data produk baru",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data produk baru. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan data produk baru. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await storeProductValidationSchema.validate(
    {
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

async function saveImage(validatedValues: ValidatedValues): Promise<string> {
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

    const targetFolderPath = getAbsolutePath("/public/storages/products");

    if (!existsSync(targetFolderPath)) {
      mkdirSync(targetFolderPath, { recursive: true });
    }

    const path = join(targetFolderPath, "/", filename);
    const uint8Array = new Uint8Array(bufferResize);
    writeFile(path, uint8Array, (error) => {
      if (error) console.error("try", error);
    });

    return path;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
