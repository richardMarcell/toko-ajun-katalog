"use client";

import { Input } from "@/components/ui/input";
import { useTicketOrderContext } from "@/contexts/ticket-online-order-context";
import { formatNumberToCurrency } from "@/lib/utils";
import {
  Product,
  SalesDetail,
} from "@/types/domains/tickets-online/sales/general";

export function TicketQuantitySelector({ product }: { product: Product }) {
  const { ticketQtyMap, ticketSalesInput, setTicketSalesInput } =
    useTicketOrderContext();

  const productQty = ticketQtyMap.get(Number(product.id)) ?? 0;

  const addTicketSalesTemporaryItem = (product: Product): void => {
    const updatedTickets = updateTickets(
      ticketSalesInput.sales_details,
      product,
      1,
    );

    setTicketSalesInput({
      ...ticketSalesInput,
      sales_details: updatedTickets,
    });
  };

  const removeTicketSalesTemporaryItem = (product: Product): void => {
    const updatedTickets = updateTickets(
      ticketSalesInput.sales_details,
      product,
      -1,
    );

    setTicketSalesInput({
      ...ticketSalesInput,
      sales_details: updatedTickets,
    });
  };

  return (
    <div className="flex justify-between">
      <div className="w-40">
        <p>{product.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => removeTicketSalesTemporaryItem(product)}
          disabled={productQty == 0}
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border p-[10px] font-bold disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          {"-"}
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-gray-100 p-[10px] font-bold">
          {productQty}
        </div>

        <button
          onClick={() => addTicketSalesTemporaryItem(product)}
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border bg-qubu_blue p-[10px] font-bold text-white"
        >
          {"+"}
        </button>
      </div>
      <Input
        type="text"
        className="w-56 text-right"
        disabled
        autoComplete="off"
        value={
          Number(product.price) === 0
            ? ""
            : formatNumberToCurrency(Number(product.price) * productQty)
        }
      />
    </div>
  );
}

const updateTickets = (
  tickets: SalesDetail[],
  product: Product,
  changeQty: number,
): SalesDetail[] => {
  const ticketsMap = new Map(
    tickets.map((ticket) => [Number(ticket.product_id), ticket]),
  );
  const productId = Number(product.id);

  if (ticketsMap.has(productId)) {
    const item = ticketsMap.get(productId)!;
    const newQty = item.qty + changeQty;

    if (newQty > 0) {
      ticketsMap.set(productId, { ...item, qty: newQty });
    } else {
      ticketsMap.delete(productId);
    }
  } else if (changeQty > 0) {
    ticketsMap.set(productId, {
      product_id: Number(product.id),
      price: Number(product.price),
      qty: 1,
    });
  }

  return Array.from(ticketsMap.values());
};
