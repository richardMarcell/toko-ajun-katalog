"use client";
import storeSales from "@/app/(main)/tickets-online/sales/create/_actions/store-sales";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useTicketOrderContext } from "@/contexts/ticket-online-order-context";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { CustomerOrigin, Product } from "@/types/domains/tickets/sales/general";
import { VendorType } from "@/types/vendor-type";
import { getDay } from "date-fns";
import { Ticket } from "lucide-react";
import { redirect } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { FestiveToggle } from "./festive-toggle";
import FormInputCreateSales from "./form-input-create-sales";
import PanelOrderSummary from "./panel-order-summary";

const IS_FESTIVE_ENABLE = false;

const TITLE = getTitle();

export function FormCreateSales({
  ticketProducts,
  customerOrigins,
  vendorTypes,
}: {
  ticketProducts: Product[];
  customerOrigins: CustomerOrigin[];
  vendorTypes: VendorType[];
}) {
  const { ticketSalesInput } = useTicketOrderContext();

  const [state, formAction] = useActionState(storeSales, initialValue);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set(
        "sales_details",
        JSON.stringify(ticketSalesInput.sales_details),
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
      redirect(state?.url ?? "");
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
                  <h2>Pembelian Tiket Online</h2>
                </div>
                {IS_FESTIVE_ENABLE && <FestiveToggle />}
              </div>
            </div>
            <FormInputCreateSales
              ticketProducts={ticketProducts}
              customerOrigins={customerOrigins}
              state={state}
            />
          </div>
          <PanelOrderSummary vendorTypes={vendorTypes} state={state} />
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
