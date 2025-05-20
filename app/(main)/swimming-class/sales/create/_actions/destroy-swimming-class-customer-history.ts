"use server";

import { db } from "@/db";
import { swimmingClassCustomerHistories } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function destroySwimmingClassCustomerHistory(
  preveState: any,
  swimmingClassCustomerHistoryId: bigint,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    await can({
      permissionNames: [PermissionEnum.SWIMMING_CLASS_DESTROY],
      user: user,
    });

    await db.transaction(async (tx) => {
      await tx
        .delete(swimmingClassCustomerHistories)
        .where(
          eq(swimmingClassCustomerHistories.id, swimmingClassCustomerHistoryId),
        );
    });

    return {
      status: "success",
      message: "Berhasil melakukan pembatalan dan menghapus transaksi",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      status: "error",
      message: "Gagal melakukan pembatalan dan menghapus transaksi",
    };
  }
}
