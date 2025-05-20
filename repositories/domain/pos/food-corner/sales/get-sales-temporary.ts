import { db } from "@/db";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { getCurrentDate } from "@/lib/utils";
import { SalesTemporary } from "@/types/domains/pos/food-corner/sales/create";

export async function getSalesTemporary(userId: number) {
  const salesTemporary = await db.query.salesTemporary.findFirst({
    where: (salesTemporary, { eq, and }) =>
      and(
        eq(salesTemporary.user_id, BigInt(userId)),
        eq(
          salesTemporary.unit_business,
          SateliteUnitConfig.food_corner.unit_business,
        ),
      ),
  });

  if (!salesTemporary)
    return {
      salesTemporary: null,
      entryTime: getCurrentDate(),
    };

  return {
    salesTemporary: salesTemporary.value as SalesTemporary,
    entryTime: salesTemporary.created_at,
  };
}
