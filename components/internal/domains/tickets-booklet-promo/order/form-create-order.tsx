"use client";
import storeTicketSalesTemporary from "@/app/(main)/tickets-booklet-promo/order/_actions/store-ticket-sales-temporary";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useTicketOrderContext } from "@/contexts/ticket-booklet-promo-order-context";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import {
  CustomerOrigin,
  Product,
  SalesTemporary,
} from "@/types/domains/tickets-booklet-promo/sales/general";
import { getDay } from "date-fns";
import { Ticket, WalletCards } from "lucide-react";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { DynamicInputWristbandCode } from "./dynamic-input-wristband-code";
import { FestiveToggle } from "./festive-toggle";
import FormInputCreateOrder from "./form-input-create-order";
import PanelOrderSummary from "./panel-order-summary";
import { WristbandQuantitySelector } from "./wristband-quantity-selector";
import { toast } from "sonner";
import { redirect, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();

  const [state, formAction] = useActionState(
    storeTicketSalesTemporary,
    initialValue,
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      const formData = getFormData(e, ticketSalesTemporaryInput, searchParams);
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
        "ticket-booklet-promo-sales-temporary",
        JSON.stringify(state.data),
      );

      redirect(state.url ?? "");
    }
  }, [state]);

  return (
    <form onSubmit={onSubmit} className="w-full">
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

function getFormData(
  e: FormEvent<HTMLFormElement>,
  ticketSalesInput: SalesTemporary,
  searchParams: URLSearchParams,
) {
  const formData = new FormData(e.currentTarget);

  formData.set("is_festive", ticketSalesInput.is_festive.toString());
  formData.set("sales_details", JSON.stringify(ticketSalesInput.sales_details));
  formData.set("wristband_qty", ticketSalesInput.wristband_qty.toString());
  formData.set("total_deposit", ticketSalesInput.total_deposit.toString());
  formData.set(
    "wristband_code_list",
    JSON.stringify(ticketSalesInput.wristband_code_list),
  );
  formData.set("promo_code", searchParams.get("promoCode") ?? "");
  formData.set("booklet_code", searchParams.get("bookletCode") ?? "");
  formData.set("tax_amount", ticketSalesInput.tax_amount.toString());
  formData.set("tax_percent", ticketSalesInput.tax_percent.toString());
  formData.set("discount_amount", ticketSalesInput.discount_amount.toString());
  formData.set(
    "discount_percent",
    ticketSalesInput.discount_percent.toString(),
  );
  formData.set("total_gross", ticketSalesInput.total_gross.toString());
  formData.set("total_net", ticketSalesInput.total_net.toString());
  formData.set("grand_total", ticketSalesInput.grand_total.toString());

  return formData;
}
