"use server";

import { db } from "@/db";
import { carts } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/server-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";

const validationSchema = yup.object({
  cart_id: yup
    .number()
    .required("ID Captain order wajib diisi")
    .typeError("ID Captain order wajib diisi dengan karakter yang valid")
    .test(
      "is-cart-exists",
      "Keranjang belanja tidak ditemukan",
      async function (cartId) {
        const cart = await db.query.carts.findFirst({
          where: (carts, { eq }) => eq(carts.id, BigInt(cartId)),
        });

        if (!cart) return false;
        return true;
      },
    ),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function destroyCart(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SALES_DESTROY],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    await db.transaction(async (tx) => {
      await tx
        .delete(carts)
        .where(eq(carts.id, BigInt(validatedValues.cart_id)));
    });

    const url = "/carts";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menghapus item dari keranjang belanja",
      url: url,
    };
  } catch (error: any) {
    if (!(error instanceof yup.ValidationError)) {
      console.error(error);

      return {
        status: "error",
        message:
          "Gagal menghapus item dari keranjang belanja. Terjadi kesalahan pada sistem",
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
        "Gagal menghapus item dari keranjang belanja. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData) {
  const validatedValues = await validationSchema.validate(
    {
      cart_id: formData.get("cart_id"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
