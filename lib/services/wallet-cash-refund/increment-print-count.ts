"use server";

import { db } from "@/db";
import { walletCashRefunds } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function incrementPrintCashRefundCount(
  walletCashRefundId: bigint,
): Promise<void> {
  await db
    .update(walletCashRefunds)
    .set({ print_count: sql`${walletCashRefunds.print_count} + 1` })
    .where(eq(walletCashRefunds.id, walletCashRefundId));
}
