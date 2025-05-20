"use server";

import { db } from "@/db";
import { captainOrders } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function incrementBillPrintCount(
  captainOrderId: bigint,
): Promise<void> {
  await db
    .update(captainOrders)
    .set({ bill_print_count: sql`${captainOrders.bill_print_count} + 1` })
    .where(eq(captainOrders.id, captainOrderId));
}
