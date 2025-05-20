import { db } from "@/db";
import { getCurrentDate } from "@/lib/utils";
import { EntryPassCustomer } from "@/types/domains/entry-pass/list";

export async function getEntryPassCustomers(): Promise<{
  entryPassCustomers: EntryPassCustomer[];
}> {
  const entryPassCustomerList = await db.query.entryPassCustomers.findMany({
    with: {
      entryPassCustomerHistories: {
        with: {
          product: {
            columns: {
              name: true,
              price: true,
            },
          },
        },
        columns: {
          id: true,
          registered_at: true,
          valid_until: true,
          sales_id: true,
        },
        orderBy: (histories, { desc }) => desc(histories.created_at),
        limit: 1,
      },
    },
    columns: {
      id: true,
      name: true,
    },
  });

  const entryPassCustomersMapped = entryPassCustomerList.map((customer) => {
    const history = customer.entryPassCustomerHistories?.[0];

    return {
      id: customer.id,
      entry_pass_customer_history_id: history?.id ?? null,
      name: customer.name,
      registered_at: history?.registered_at ?? getCurrentDate(),
      valid_until: history?.valid_until ?? getCurrentDate(),
      product_name: history?.product?.name ?? "-",
      price: history?.product?.price ?? "0",
      can_make_payment: !!(history && !history.sales_id),
    };
  });

  return {
    entryPassCustomers: entryPassCustomersMapped,
  };
}
