"use server";

import { db } from "@/db";
import { captainOrders } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { and, desc, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { validationSchema } from "./_libs/validation-schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function storeCaptainOrder(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.DIMSUM_CAPTAIN_ORDER_STORE],
    user: user,
  });

  let captainOrderId: bigint | null = null;
  try {
    const validatedValues = await validateRequest(formData);
    const captainOrderCode = await getCaptainOrderCode();
    const orderNumber = await getOrderNumber();

    await db.transaction(async (tx) => {
      const captainOrderCreated = await tx
        .insert(captainOrders)
        .values({
          code: captainOrderCode,
          order_number: orderNumber,
          customer_name: validatedValues.customer_name,
          compliment: validatedValues.compliment,
          customer_adult_count: validatedValues.customer_adult_count,
          customer_child_count: validatedValues.customer_child_count,
          meal_time: validatedValues.meal_time,
          order_type: validatedValues.order_type,
          outlet: validatedValues.outlet,
          table_id: BigInt(validatedValues.table_id),
          created_by: BigInt(user.id),

          discount_amount: "0",
          discount_percent: 0,
          tax_amount: "0",
          tax_percent: 0,
          total_gross: "0",
          total_net: "0",
          grand_total: "0",

          unit_business: UnitBusinessSateliteQubuEnum.DIMSUM,
        })
        .$returningId();
      captainOrderId = captainOrderCreated[0].id;
    });

    return {
      status: "success",
      message: "Berhasil melakukan open captain order",
      url: `/pos/dimsum/captain-order/${captainOrderId}/edit`,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal melakukan open captain order. Terjadi kesalahan pada sistem",
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
        "Gagal melakukan open captain order. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData) {
  const validatedValues = await validationSchema.validate(
    {
      table_id: formData.get("table_id"),
      meal_time: formData.get("meal_time"),
      customer_name: formData.get("customer_name"),
      outlet: formData.get("outlet"),
      compliment: formData.get("compliment"),
      order_type: formData.get("order_type"),
      customer_adult_count: formData.get("customer_adult_count"),
      customer_child_count: formData.get("customer_child_count"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

async function getCaptainOrderCode(): Promise<string> {
  const lastRecordOfCaptainOrder = await db
    .select({
      code: captainOrders.code,
    })
    .from(captainOrders)
    .orderBy(desc(captainOrders.created_at))
    .limit(1);

  const lastNumber =
    lastRecordOfCaptainOrder.length > 0
      ? Number(lastRecordOfCaptainOrder[0].code.replace("#", ""))
      : 10000;

  const captainOrderCode = `#${(lastNumber + 1).toString().padStart(5, "0")}`;

  return captainOrderCode;
}

async function getOrderNumber(): Promise<string> {
  const lastRecordOfCaptainOrder = await db
    .select({
      order_number: captainOrders.order_number,
    })
    .from(captainOrders)
    .where(
      and(
        sql`DATE(${captainOrders.created_at}) = DATE(NOW())`,
        eq(captainOrders.unit_business, UnitBusinessSateliteQubuEnum.DIMSUM),
      ),
    )
    .orderBy(desc(captainOrders.created_at))
    .limit(1);

  const lastNumber =
    lastRecordOfCaptainOrder.length > 0
      ? Number(lastRecordOfCaptainOrder[0].order_number.replace("#", ""))
      : 0;

  const orderNumber = `#${(lastNumber + 1).toString().padStart(4, "0")}`;

  return orderNumber;
}
