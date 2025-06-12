"use server";

import { db } from "@/db";
import { saleRatings } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/server-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeSaleRatingValidationSchema } from "./_libs/store-sale-rating-validation-schema";

type ValidatedValues = {
  sale_id: number;
  rating: number;
  comment?: string | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function storeSaleRating(
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

    await db.transaction(async (tx) => {
      const { sale_id, rating, comment } = validatedValues;

      await tx.insert(saleRatings).values({
        user_id: BigInt(user.id),
        sales_id: BigInt(sale_id),
        rating: rating,
        comment: comment ? comment : null,
      });
    });

    revalidatePath(`/order-list`);

    return {
      status: "success",
      message: "Berhasil mengirimkan rating",
    };
  } catch (error: any) {
    if (!(error instanceof yup.ValidationError)) {
      console.error(error);

      return {
        status: "error",
        message: "Gagal mengirimkan rating. Terjadi kesalahan pada sistem",
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
        "Gagal mengirimkan rating. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await storeSaleRatingValidationSchema.validate(
    {
      sale_id: formData.get("sale_id"),
      rating: formData.get("rating"),
      comment: formData.get("comment"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
