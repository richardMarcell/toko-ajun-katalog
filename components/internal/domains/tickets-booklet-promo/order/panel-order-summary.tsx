"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useTicketOrderContext } from "@/contexts/ticket-booklet-promo-order-context";
import { formatNumberToCurrency } from "@/lib/utils";
import Image from "next/image";

export default function PanelOrderSummary() {
  const {
    ticketSalesTemporaryInput,
    setTicketSalesTemporaryInput,
    initialTicketSalesTemporary,
  } = useTicketOrderContext();

  const handleCancel = () => {
    setTicketSalesTemporaryInput(initialTicketSalesTemporary);

    if (sessionStorage.getItem("ticket-booklet-promo-sales-temporary"))
      sessionStorage.removeItem("ticket-booklet-promo-sales-temporary");
  };

  return (
    <div className="w-[40%]">
      <Image
        src="/assets/imgs/header-card.png"
        alt="header-card"
        width={600}
        height={0}
        className="w-full rounded-lg object-contain p-1"
      />
      <Card className="rounded-tl-none rounded-tr-none border">
        <CardContent className="pt-4">
          <div>
            <div className="grid grid-cols-2">
              <p>Subtotal</p>
              <p className="text-right">
                {formatNumberToCurrency(ticketSalesTemporaryInput.total_gross)}
              </p>
            </div>
            <div className="grid grid-cols-2 pt-4">
              <p>Deposit Gelang</p>
              <p className="text-right">
                {formatNumberToCurrency(
                  ticketSalesTemporaryInput.total_deposit,
                )}
              </p>
            </div>
          </div>

          <div className="max-h-[410px] border-b-2 border-dashed border-b-gray-300 pt-8"></div>

          <div className="mt-4 space-y-4 rounded-lg">
            <div className="flex justify-between text-2xl font-bold">
              <div className="w-20">Total</div>
              <div className="">
                {formatNumberToCurrency(ticketSalesTemporaryInput.grand_total)}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button className="mt-4 w-full bg-black p-2" type="submit">
            Proceed
          </Button>
          <Button
            onClick={handleCancel}
            className="mt-4 w-full bg-black/50 p-2"
            type="button"
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
