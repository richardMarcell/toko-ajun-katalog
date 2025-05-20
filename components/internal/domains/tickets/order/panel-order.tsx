"use client";

import { TicketOrderProvider } from "@/contexts/ticket-order-context";
import { FormCreateOrder } from "./form-create-order";
import { CustomerOrigin, Product } from "@/types/domains/tickets/sales/general";

export function PanelOrder({
  ticketProducts,
  wristbandProduct,
  customerOrigins,
}: {
  ticketProducts: Product[];
  wristbandProduct: Product | null;
  customerOrigins: CustomerOrigin[];
}) {
  return (
    <TicketOrderProvider>
      <FormCreateOrder
        customerOrigins={customerOrigins}
        ticketProducts={ticketProducts}
        wristbandProduct={wristbandProduct}
      />
    </TicketOrderProvider>
  );
}
