import { db } from "@/db";
import { EntryPassCustomerHistoryIncludeRelations } from "@/types/domains/entry-pass/sales/create";
import { isNull } from "drizzle-orm";

export async function getEntryPassCustomerHistory(
  entryPassCustomerHistoryId: bigint,
): Promise<{
  entryPassCustomerHistory: EntryPassCustomerHistoryIncludeRelations | null;
}> {
  const entryPassCustomerHistory =
    await db.query.entryPassCustomerHistories.findFirst({
      with: {
        product: true,
        entryPassCustomer: true,
      },
      where: (entryPassCustomerHistories, { eq, and }) =>
        and(
          eq(entryPassCustomerHistories.id, entryPassCustomerHistoryId),
          isNull(entryPassCustomerHistories.sales_id),
        ),
    });

  if (!entryPassCustomerHistory)
    return {
      entryPassCustomerHistory: null,
    };

  return {
    entryPassCustomerHistory: entryPassCustomerHistory,
  };
}
