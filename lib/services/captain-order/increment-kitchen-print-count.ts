"use server";

import { db } from "@/db";
import { captainOrders } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function incrementKitchenPrintCount(
  captainOrderId: bigint,
): Promise<void> {
  await db
    .update(captainOrders)
    .set({ kitchen_print_count: sql`${captainOrders.kitchen_print_count} + 1` })
    .where(eq(captainOrders.id, captainOrderId));
}
