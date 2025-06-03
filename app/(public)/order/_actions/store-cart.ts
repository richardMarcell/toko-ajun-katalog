"use server";

import { db } from "@/db";
import { carts, products } from "@/db/schema";

import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { Cart } from "@/types/cart";
import { User } from "@/types/next-auth";
import { Product } from "@/types/product";
import { ServerActionResponse } from "@/types/server-action";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeCartValidationSchema } from "./_libs/store-cart-validation-schema";

type ValidatedValues = {
  note?: string | null;
  qty: number;
  product_id: number;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function storeCart(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SALES_STORE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    const product = await getProduct(BigInt(validatedValues.product_id));
    const cart = await getCarts(validatedValues, user);

    if (product) {
      await db.transaction(async (tx) => {
        if (!cart) {
          await tx.insert(carts).values({
            user_id: BigInt(user.id),
            product_id: BigInt(validatedValues.product_id),
            qty: validatedValues.qty,
            note: validatedValues.note,
            price: product.price,
            subtotal: (Number(product.price) * validatedValues.qty).toString(),
          });
        } else {
          const subtotal = Number(product.price) * validatedValues.qty;
          await tx
            .update(carts)
            .set({
              qty: sql`${carts.qty} + ${validatedValues.qty}`,
              note: validatedValues.note,
              subtotal: sql`${carts.subtotal} + ${subtotal}`,
            })
            .where(eq(carts.id, cart.id));
        }
      });
    }

    revalidatePath(`/order`);
    revalidatePath(`/carts`);

    return {
      status: "success",
      message: "Berhasil menambahkan pesanan ke keranjang",
    };
  } catch (error: any) {
    if (!(error instanceof yup.ValidationError)) {
      console.error(error);

      return {
        status: "error",
        message:
          "Gagal melakukan pemesanan produk. Terjadi kesalahan pada sistem",
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
        "Gagal melakukan pemesanan produk. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData) {
  const validatedValues = await storeCartValidationSchema.validate(
    {
      product_id: formData.get("product_id"),
      qty: formData.get("qty"),
      note: formData.get("note"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

async function getCarts(
  validatedValues: ValidatedValues,
  user: User,
): Promise<Cart | null> {
  const cart = await db.query.carts.findFirst({
    where: and(
      eq(carts.user_id, BigInt(user.id)),
      eq(carts.product_id, BigInt(validatedValues.product_id)),
    ),
  });

  if (!cart) return null;

  return cart;
}

async function getProduct(productId: bigint): Promise<Product | null> {
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!product) return null;

  return product;
}
