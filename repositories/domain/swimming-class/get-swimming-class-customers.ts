import { db } from "@/db";
import { getCurrentDate } from "@/lib/utils";
import { SwimmingClassCustomer } from "@/types/domains/swimming-class/list";

export async function getSwimmingClassCustomers(): Promise<{
  swimmingClassCustomers: SwimmingClassCustomer[];
}> {
  const swimmingClassCustomerList =
    await db.query.swimmingClassCustomers.findMany({
      with: {
        swimmingClassCustomerHistories: {
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

  const swimmingClassCustomersMapped = swimmingClassCustomerList.map(
    (customer) => {
      const history = customer.swimmingClassCustomerHistories?.[0];

      return {
        id: customer.id,
        swimming_class_customer_history_id: history?.id ?? null,
        name: customer.name,
        registered_at: history?.registered_at ?? getCurrentDate(),
        valid_until: history?.valid_until ?? getCurrentDate(),
        product_name: history?.product?.name ?? "-",
        price: history?.product?.price ?? "0",
        can_make_payment: !!(history && !history.sales_id),
      };
    },
  );

  return {
    swimmingClassCustomers: swimmingClassCustomersMapped,
  };
}
