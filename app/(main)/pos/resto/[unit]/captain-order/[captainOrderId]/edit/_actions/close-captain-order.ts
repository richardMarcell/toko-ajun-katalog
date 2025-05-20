"use server";

import { getCaptainOrder } from "@/app/(main)/pos/resto/_repositories/get-captain-order";
import { db } from "@/db";
import { captainOrders } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";

const validationSchema = yup.object({
  captain_order_id: yup
    .number()
    .required("ID Captain order wajib diisi")
    .typeError("ID Captain order wajib diisi dengan karakter yang valid")
    .test(
      "is-captain-order-exists",
      "Captain order tidak terdaftar dalam sistem",
      async function (captainOrderId) {
        const captainOrder = await db.query.captainOrders.findFirst({
          where: (captainOrders, { eq }) =>
            eq(captainOrders.id, BigInt(captainOrderId)),
        });

        if (!captainOrder) return false;
        return true;
      },
    ),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function closeCaptainOrder(
  prevState: any,
  captainOrderId: bigint,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_UPDATE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(captainOrderId);
    const captainOrderIdValidated = validatedValues.captain_order_id.toString();

    const { captainOrder } = await getCaptainOrder(captainOrderIdValidated);
    if (!captainOrder) {
      return {
        status: "error",
        message:
          "Tidak dapat melanjutkan proses. Captain order tidak terdaftar dalam sistem",
      };
    }

    if (captainOrder.captainOrderDetails.length === 0) {
      return {
        status: "error",
        message:
          "Tidak dapat melanjutkan proses. Belum terdapat menu yang dipesan oleh pelanggan.",
      };
    }

    if (captainOrder.is_closed) {
      return {
        status: "error",
        message:
          "Tidak dapat melanjutkan proses. Transaksi captain order ini sudah di close.",
      };
    }

    await db.transaction(async (tx) => {
      await tx
        .update(captainOrders)
        .set({
          is_closed: true,
        })
        .where(eq(captainOrders.id, captainOrder.id));
    });

    revalidatePath(`/pos/resto/patio/captain-order/${captainOrder.id}/edit`);

    return {
      status: "success",
      message: "Berhasil menutup transaksi captain order",
    };
  } catch (error: any) {
    if (!(error instanceof yup.ValidationError)) {
      console.error(error);

      return {
        status: "error",
        message:
          "Gagal menutup transaksi captain order. Terjadi kesalahan pada sistem",
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
        "Gagal menutup transaksi captain order. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(captainOrderId: bigint) {
  const validatedValues = await validationSchema.validate(
    {
      captain_order_id: captainOrderId,
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
