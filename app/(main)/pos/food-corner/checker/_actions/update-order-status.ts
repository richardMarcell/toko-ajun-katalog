"use server";

import { db } from "@/db";
import { salesDetails } from "@/db/schema";
import { OrderStatusEnum } from "@/lib/enums/OrderStatusEnum";
import { inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus({
  salesDetailsIds,
}: {
  salesDetailsIds: bigint[];
}): Promise<void> {
  await db
    .update(salesDetails)
    .set({ order_status: OrderStatusEnum.SERVE })
    .where(inArray(salesDetails.id, salesDetailsIds));

  revalidatePath("/pos/food-corner/checker");
}
