"use server";

import { db } from "@/db";
import { carts as cartSchema, sales, salesDetails } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/server-action";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";

const validationSchema = yup.object({
  user_id: yup
    .number()
    .required("ID pengguna wajib diisi")
    .typeError("ID pengguna wajib diisi dengan karakter yang valid")
    .test("is-user-exists", "User tidak terdaftar", async function (userId) {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, BigInt(userId)),
      });

      if (!user) return false;
      return true;
    }),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function storeSales(
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
      const carts = await tx.query.carts.findMany({
        where: eq(cartSchema.user_id, BigInt(validatedValues.user_id)),
      });

      if (carts.length > 0) {
        const total = carts.reduce(
          (acc, item) => acc + Number(item.subtotal),
          0,
        );

        const salesCreated = await tx
          .insert(sales)
          .values({
            code: await getSalesCode(),
            created_by: BigInt(validatedValues.user_id),
            grand_total: total.toString(),
          })
          .$returningId();

        const salesId = salesCreated[0].id;

        await tx.insert(salesDetails).values(
          carts.map((cart) => ({
            sales_id: salesId,
            product_id: cart.product_id,
            qty: cart.qty,
            price: cart.price,
            subtotal: cart.subtotal,
          })),
        );

        await tx
          .delete(cartSchema)
          .where(eq(cartSchema.user_id, BigInt(validatedValues.user_id)));
      }
    });

    const url = "/order-list";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil meproses pesanan item",
      url: url,
    };
  } catch (error: any) {
    if (!(error instanceof yup.ValidationError)) {
      console.error(error);

      return {
        status: "error",
        message: "Gagal meproses pesanan item. Terjadi kesalahan pada sistem",
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
        "Gagal meproses pesanan item. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData) {
  const validatedValues = await validationSchema.validate(
    {
      user_id: formData.get("user_id"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

export async function getSalesCode(): Promise<string> {
  const lastRecordOfSales = await db
    .select({
      code: sales.code,
    })
    .from(sales)
    .orderBy(desc(sales.created_at))
    .limit(1);

  const lastNumber =
    lastRecordOfSales.length > 0
      ? Number(lastRecordOfSales[0].code.replace("INV-", ""))
      : 0;

  const orderNumber = `INV-${(lastNumber + 1).toString().padStart(4, "0")}`;

  return orderNumber;
}
