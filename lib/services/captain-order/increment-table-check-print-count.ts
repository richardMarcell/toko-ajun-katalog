"use server";

import { db } from "@/db";
import { captainOrders } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function incrementTableCheckPrintCount(
  captainOrderId: bigint,
): Promise<void> {
  await db
    .update(captainOrders)
    .set({
      table_check_print_count: sql`${captainOrders.table_check_print_count} + 1`,
    })
    .where(eq(captainOrders.id, captainOrderId));
}
