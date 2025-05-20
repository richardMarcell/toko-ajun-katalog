import { db } from "@/db";
import {
  getTicketOnlineProductIds,
  getTicketWeekdayProductIds,
  getTicketWeekendProductIds,
} from "@/lib/services/ticket/get-ticket-product-ids";
import { getCurrentDate } from "@/lib/utils";

import { Product } from "@/types/domains/tickets-online/sales/general";
import { getDay } from "date-fns";
import { inArray } from "drizzle-orm";

// NOTE: enable festive on components\internal\domains\tickets-online\sales\create\form-create-sales.tsx
// for UI checkbox
const IS_FESTIVE_ENABLE = false;

export async function getTicketProducts({
  festive,
}: {
  festive: string;
}): Promise<{
  ticketProducts: Product[];
}> {
  const today = getCurrentDate();
  const day = getDay(today);

  const isWeekend = day === 0 || day === 6;
  const isFestive = festive == "true" ? true : false;

  const ticketProducts = await db.query.products.findMany({
    where: (products) => {
      if (IS_FESTIVE_ENABLE) {
        return inArray(
          products.id,
          isWeekend || isFestive
            ? getTicketWeekendProductIds()
            : getTicketWeekdayProductIds(),
        );
      }
      return inArray(products.id, getTicketOnlineProductIds());
    },

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
