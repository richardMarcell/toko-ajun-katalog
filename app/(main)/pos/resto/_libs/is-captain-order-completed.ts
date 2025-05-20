import { db } from "@/db";
import { captainOrderDetails } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function isCaptainOrderCompleted(
  captainOrderId: string,
): Promise<boolean> {
  const captainOrderDetail = await db
    .select({
      totalQty: sql<number>`SUM(${captainOrderDetails.qty})`,
      totalPaid: sql<number>`SUM(${captainOrderDetails.paid_qty})`,
    })
    .from(captainOrderDetails)
    .where(eq(captainOrderDetails.captain_order_id, BigInt(captainOrderId)))
    .groupBy(captainOrderDetails.captain_order_id);

  const totalQty = captainOrderDetail[0]
    ? Number(captainOrderDetail[0]?.totalQty)
    : 0;
  const totalPaidQty = captainOrderDetail[0]
    ? Number(captainOrderDetail[0]?.totalPaid)
    : 0;

  if (totalPaidQty < 1) return true;

  if (totalPaidQty < totalQty) return true;
  else return false;
}
