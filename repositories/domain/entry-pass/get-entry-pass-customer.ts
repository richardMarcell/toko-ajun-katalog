import { db } from "@/db";
import { EntryPassCustomerWithHistories } from "@/types/domains/entry-pass/edit";

export async function getEntryPassCustomer(
  entryPassCustomerId: string,
): Promise<{
  entryPassCustomer: EntryPassCustomerWithHistories | null;
}> {
  const entryPassCustomer = await db.query.entryPassCustomers.findFirst({
    with: {
      entryPassCustomerHistories: {
        with: {
          product: true,
        },
        orderBy: (entryPassCustomerHistories, { desc }) =>
          desc(entryPassCustomerHistories.created_at),
      },
    },
    where: (entryPassCustomers, { eq }) =>
      eq(entryPassCustomers.id, BigInt(entryPassCustomerId)),
  });

  if (!entryPassCustomer)
    return {
      entryPassCustomer: null,
    };

  return {
    entryPassCustomer: entryPassCustomer,
  };
}
