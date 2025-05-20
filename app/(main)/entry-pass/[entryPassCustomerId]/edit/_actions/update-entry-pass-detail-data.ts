"use server";

import { db } from "@/db";
import { entryPassCustomerHistories } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { addToDate } from "@/lib/utils";
import { ServerActionResponse } from "@/types/domains/server-action";
import { and, eq, isNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { updateDetailDataValidationSchema } from "./_libs/update-detail-data-validation-schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function updateEntryPassDetailData(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [
      PermissionEnum.ENTRY_PASS_UPDATE_ALL,
      PermissionEnum.ENTRY_PASS_UPDATE_DETAIL_DATA,
    ],
    user: user,
  });

  try {
    const validatedValues = await updateDetailDataValidationSchema.validate(
      {
        entry_pass_customer_id: formData.get("entry_pass_customer_id"),
        product_id: formData.get("product_id"),
        registered_at: formData.get("registered_at"),
      },
      {
        abortEarly: false,
      },
    );

    const isCustomerHasUnpaidEntryPass = await hasUnpaidEntryPassForCustomer(
      BigInt(validatedValues.entry_pass_customer_id),
    );

    if (isCustomerHasUnpaidEntryPass)
      return {
        status: "error",
        message: "Masih terdapat transaksi entry pass yang belum diselesaikan",
      };

    await db.transaction(async (tx) => {
      const product = await db.query.products.findFirst({
        where: (products, { eq }) =>
          eq(products.id, BigInt(validatedValues.product_id)),
        columns: {
          ep_valid_term: true,
        },
      });

      await tx.insert(entryPassCustomerHistories).values({
        created_by: BigInt(user.id),
        product_id: BigInt(validatedValues.product_id),
        registered_at: validatedValues.registered_at,
        ep_customer_id: BigInt(validatedValues.entry_pass_customer_id),
        valid_until: addToDate(
          validatedValues.registered_at,
          product?.ep_valid_term ?? 0,
          "day",
        ),
      });
    });

    revalidatePath("/entry-pass");

    return {
      status: "success",
      message: "Berhasil melakukan perubahan data entry pass",
    };
  } catch (error: any) {
    if (!(error instanceof yup.ValidationError)) {
      console.error(error);

      return {
        status: "error",
        message:
          "Gagal melakukan perubahan data entry pass. Terjadi kesalahan pada sistem",
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
        "Gagal melakukan perubahan data entry pass. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function hasUnpaidEntryPassForCustomer(
  entryPassCustomerId: bigint,
): Promise<boolean> {
  const result = await db
    .select({
      count: sql`COUNT(${entryPassCustomerHistories.id})`,
    })
    .from(entryPassCustomerHistories)
    .where(
      and(
        eq(entryPassCustomerHistories.ep_customer_id, entryPassCustomerId),
        isNull(entryPassCustomerHistories.sales_id),
      ),
    );

  const countUnpaidEntryPassByCustomer = Number(result[0]?.count) || 0;

  if (countUnpaidEntryPassByCustomer > 0) return true;
  else return false;
}
