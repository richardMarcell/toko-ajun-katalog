"use server";

import { db } from "@/db";
import { sales } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function incrementPrintCount(saleId: bigint): Promise<void> {
  await db
    .update(sales)
    .set({ print_count: sql`${sales.print_count} + 1` })
    .where(eq(sales.id, saleId));
}
