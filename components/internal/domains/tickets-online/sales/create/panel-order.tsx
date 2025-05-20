"use client";

import { TicketOrderProvider } from "@/contexts/ticket-online-order-context";
import { CustomerOrigin, Product } from "@/types/domains/tickets/sales/general";
import { FormCreateSales } from "./form-create-sales";
import { VendorType } from "@/types/vendor-type";

export function PanelOrder({
  ticketProducts,
  customerOrigins,
  vendorTypes,
}: {
  ticketProducts: Product[];
  customerOrigins: CustomerOrigin[];
  vendorTypes: VendorType[];
}) {
  return (
    <TicketOrderProvider>
      <FormCreateSales
        customerOrigins={customerOrigins}
        ticketProducts={ticketProducts}
        vendorTypes={vendorTypes}
      />
    </TicketOrderProvider>
  );
}
