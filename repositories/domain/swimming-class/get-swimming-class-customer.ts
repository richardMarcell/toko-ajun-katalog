import { db } from "@/db";
import { SwimmingClassCustomerWithHistories } from "@/types/domains/swimming-class/edit";

export async function getSwimmingClassCustomer(
  swimmingClassCustomerId: string,
): Promise<{
  swimmingClassCustomer: SwimmingClassCustomerWithHistories | null;
}> {
  const swimmingClassCustomer = await db.query.swimmingClassCustomers.findFirst(
    {
      with: {
        swimmingClassCustomerHistories: {
          with: {
            product: true,
          },
          orderBy: (swimmingClassCustomerHistories, { desc }) =>
            desc(swimmingClassCustomerHistories.created_at),
        },
      },
      where: (swimmingClassCustomers, { eq }) =>
        eq(swimmingClassCustomers.id, BigInt(swimmingClassCustomerId)),
    },
  );

  if (!swimmingClassCustomer)
    return {
      swimmingClassCustomer: null,
    };

  return {
    swimmingClassCustomer: swimmingClassCustomer,
  };
}
