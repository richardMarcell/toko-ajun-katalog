import { db } from "@/db";
import { SwimmingClassCustomerHistoryIncludeRelations } from "@/types/domains/swimming-class/sales/create";
import { isNull } from "drizzle-orm";

export async function getSwimmingClassCustomerHistory(
  swimmingClassCustomerHistoryId: bigint,
): Promise<{
  swimmingClassCustomerHistory: SwimmingClassCustomerHistoryIncludeRelations | null;
}> {
  const swimmingClassCustomerHistory =
    await db.query.swimmingClassCustomerHistories.findFirst({
      with: {
        product: true,
        swimmingClassCustomer: true,
      },
      where: (swimmingClassCustomerHistories, { eq, and }) =>
        and(
          eq(swimmingClassCustomerHistories.id, swimmingClassCustomerHistoryId),
          isNull(swimmingClassCustomerHistories.sales_id),
        ),
    });

  if (!swimmingClassCustomerHistory)
    return {
      swimmingClassCustomerHistory: null,
    };

  return {
    swimmingClassCustomerHistory: swimmingClassCustomerHistory,
  };
}
