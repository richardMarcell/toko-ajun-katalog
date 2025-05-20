"use client";
import storeTicketSalesTemporary from "@/app/(main)/tickets/order/_actions/store-ticket-sales-temporary";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useTicketOrderContext } from "@/contexts/ticket-order-context";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { CustomerOrigin, Product } from "@/types/domains/tickets/sales/general";
import { getDay } from "date-fns";
import { Ticket, WalletCards } from "lucide-react";
import { redirect } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { DynamicInputWristbandCode } from "./dynamic-input-wristband-code";
import { FestiveToggle } from "./festive-toggle";
import FormInputCreateOrder from "./form-input-create-order";
import PanelOrderSummary from "./panel-order-summary";
import { WristbandQuantitySelector } from "./wristband-quantity-selector";

const TITLE = getTitle();

export function FormCreateOrder({
  ticketProducts,
  wristbandProduct,
  customerOrigins,
}: {
  ticketProducts: Product[];
  wristbandProduct: Product | null;
  customerOrigins: CustomerOrigin[];
}) {
  const { ticketSalesTemporaryInput } = useTicketOrderContext();

  const [state, formAction] = useActionState(
    storeTicketSalesTemporary,
    initialValue,
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set(
        "is_festive",
        ticketSalesTemporaryInput.is_festive.toString(),
      );
      formData.set(
        "sales_details",
        JSON.stringify(ticketSalesTemporaryInput.sales_details),
      );
      formData.set(
        "wristband_qty",
        ticketSalesTemporaryInput.wristband_qty.toString(),
      );
      formData.set(
        "total_deposit",
        ticketSalesTemporaryInput.total_deposit.toString(),
      );
      formData.set(
        "wristband_code_list",
        JSON.stringify(ticketSalesTemporaryInput.wristband_code_list),
      );

      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 2000,
      });
    }

    if (state.status == "success") {
      sessionStorage.setItem(
        "ticket-sales-temporary",
        JSON.stringify(state.data),
      );

      redirect("/tickets/sales/create");
    }
  }, [state]);

  return (
    <form onSubmit={onSubmit}>
      <Card className="w-full px-4 py-5">
        <CardContent className="flex gap-4 p-2">
          <div className="w-[60%]">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{TITLE}</CardTitle>
              <div className="flex items-center justify-between border-b py-4">
                <div className="flex items-center space-x-2">
                  <Ticket />
                  <h2>Pembelian Tiket</h2>
                </div>
                <FestiveToggle />
              </div>
            </div>
            <FormInputCreateOrder
              ticketProducts={ticketProducts}
              customerOrigins={customerOrigins}
              state={state}
            />

            {wristbandProduct && (
              <div className="pt-8">
                <div className="flex items-center justify-between border-b py-4">
                  <div className="flex items-center space-x-2">
                    <WalletCards />
                    <h2>Deposit Gelang</h2>
                  </div>
                </div>
                <WristbandQuantitySelector
                  wristbandProduct={wristbandProduct}
                />
                <DynamicInputWristbandCode state={state} />
              </div>
            )}
          </div>
          <PanelOrderSummary />
        </CardContent>
      </Card>
    </form>
  );
}

function getTitle(): string {
  const day = getDay(new Date());

  if (day >= 1 && day <= 5) return "Weekday (Senin - Jumat)";
  else return "Weekend (Sabtu - Minggu)";
}
