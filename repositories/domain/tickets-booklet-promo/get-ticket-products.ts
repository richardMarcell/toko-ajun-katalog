import { db } from "@/db";
import {
  getTicketWeekdayProductIds,
  getTicketWeekendProductIds,
} from "@/lib/services/ticket/get-ticket-product-ids";
import { Product } from "@/types/domains/tickets-booklet-promo/sales/general";
import { getDay } from "date-fns";
import { inArray } from "drizzle-orm";

export async function getTicketProducts({
  festive,
}: {
  festive: string;
}): Promise<{
  ticketProducts: Product[];
}> {
  const today = new Date();
  const day = getDay(today);

  const isWeekend = day === 0 || day === 6;
  const isFestive = festive == "true" ? true : false;

  const ticketProducts = await db.query.products.findMany({
    where: (products) =>
      inArray(
        products.id,
        isWeekend || isFestive
          ? getTicketWeekendProductIds()
          : getTicketWeekdayProductIds(),
      ),
    columns: {
      id: true,
      code: true,
      name: true,
      description: true,
      price: true,
    },
  });

  return { ticketProducts: ticketProducts };
}
