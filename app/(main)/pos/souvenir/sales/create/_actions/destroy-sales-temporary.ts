"use server";

import { db } from "@/db";
import { salesTemporary } from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { ServerActionResponse } from "@/types/domains/server-action";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function destroySalesTemporary(): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    await db.transaction(async (tx) => {
      await tx
        .delete(salesTemporary)
        .where(
          and(
            eq(salesTemporary.user_id, BigInt(user.id)),
            eq(
              salesTemporary.unit_business,
              SateliteUnitConfig.souvenir.unit_business,
            ),
          ),
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
