"use client";

import { Input } from "@/components/ui/input";
import { useTicketOrderContext } from "@/contexts/ticket-order-context";
import { formatNumberToCurrency } from "@/lib/utils";
import { Product } from "@/types/domains/tickets/sales/general";

export function WristbandQuantitySelector({
  wristbandProduct,
}: {
  wristbandProduct: Product;
}) {
  const { setTicketSalesTemporaryInput, ticketSalesTemporaryInput } =
    useTicketOrderContext();

  const handleChangeWristbandQty = (change: number) => {
    const currentQty = ticketSalesTemporaryInput.wristband_qty;
    const newQty = currentQty + change;
    if (newQty < 0) return;

    const price = Number(wristbandProduct.price);
    const currentTotalDeposit = price * currentQty;
    const newTotalDeposit = price * newQty;

    const depositDiff = newTotalDeposit - currentTotalDeposit;

    const newGrandTotal = ticketSalesTemporaryInput.grand_total + depositDiff;

    const currentWristbandCodes = ticketSalesTemporaryInput.wristband_code_list;

    const newWristbandCodes =
      newQty > currentQty
        ? currentWristbandCodes
        : currentWristbandCodes.slice(0, newQty);

    setTicketSalesTemporaryInput({
      ...ticketSalesTemporaryInput,
      grand_total: newGrandTotal,
      wristband_code_list: newWristbandCodes,
      total_deposit: newTotalDeposit,
      wristband_qty: newQty,
    });
  };

  return (
    <div className="flex justify-between pt-4">
      <div className="w-40">
        <p>{wristbandProduct.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleChangeWristbandQty(-1)}
          disabled={ticketSalesTemporaryInput.wristband_qty === 0}
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border p-[10px] font-bold disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          {"-"}
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-gray-100 p-[10px] font-bold">
          {ticketSalesTemporaryInput.wristband_qty}
        </div>

        <button
          onClick={() => handleChangeWristbandQty(1)}
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
        value={formatNumberToCurrency(
          Number(wristbandProduct.price) *
            ticketSalesTemporaryInput.wristband_qty,
        )}
        autoComplete="off"
      />
    </div>
  );
}
