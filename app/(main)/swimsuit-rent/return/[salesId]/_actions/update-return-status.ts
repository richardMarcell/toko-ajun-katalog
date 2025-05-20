"use server";

import { db } from "@/db";
import { stockSwimsuitRent, swimsuitRentWallet } from "@/db/schema";
import { SwimsuitRentReturnStatusEnum } from "@/lib/enums/SwimsuitRentReturnStatusEnum";
import { getCurrentDate } from "@/lib/utils";
import { ServerActionResponse } from "@/types/domains/server-action";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function updateReturnStatus(
  prevState: any,
  salesDetailId: bigint,
): Promise<ServerActionResponse> {
  try {
    await db.transaction(async (tx) => {
      const salesDetail = await tx.query.salesDetails.findFirst({
        where: (salesDetail, { eq }) => eq(salesDetail.id, salesDetailId),
      });

      if (!salesDetail)
        return {
          status: "error",
          message: "Data penjualan detail tidak ditemukan",
        };

      await tx
        .update(stockSwimsuitRent)
        .set({
          qty: sql`${stockSwimsuitRent.qty} + ${salesDetail.qty ?? 0}`,
        })
        .where(eq(stockSwimsuitRent.product_id, salesDetail.product_id));

      await tx
        .update(swimsuitRentWallet)
        .set({
          return_status: SwimsuitRentReturnStatusEnum.HAS_RETURNED,
          returned_at: getCurrentDate(),
        })
        .where(eq(swimsuitRentWallet.sales_detail_id, salesDetailId));
    });

    revalidatePath(`/swimsuit-rent/return/[salesId]`, "page");

    return {
      status: "success",
      message: "Berhasil melakukan pengembalian baju renang",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      status: "error",
      message: "Gagal melakukan pengembalian baju renang",
    };
  }
}
