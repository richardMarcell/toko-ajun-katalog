import { db } from "@/db";
import { CustomerOrigin } from "@/types/domains/tickets-online/sales/general";

export async function getCustomerOrigins(): Promise<{
  customerOrigins: CustomerOrigin[];
}> {
  const customerOrigins = await db.query.customerOrigins.findMany({
    columns: {
      id: true,
      name: true,
    },
  });

  return {
    customerOrigins: customerOrigins,
  };
}
