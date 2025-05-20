"use client";

import storeSales from "@/app/(main)/tickets-booklet-promo/sales/create/_actions/store-sales";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import getPaymentMethod from "@/lib/services/payments/get-payment-method";
import { formatNumberToCurrency } from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { SalesTemporary } from "@/types/domains/tickets-booklet-promo/sales/general";
import { PaymentMultiple } from "@/types/payment-multiple";
import { Printer } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import FormMultiplePayments from "../../../form-multiple-payments";
import { ButtonDeleteTicketSalesTemporary } from "./button-delete-ticket-sales-temporary";

export function FormCreateSales() {
  const [state, formAction] = useActionState(storeSales, initialValue);
  const searchParams = useSearchParams();

  const ticketSalesTemporaryOrigin: SalesTemporary = JSON.parse(
    sessionStorage.getItem("ticket-booklet-promo-sales-temporary") as string,
  );
  if (!ticketSalesTemporaryOrigin) redirect("/tickets-booklet-promo/order");

  const [payments, setPayments] = useState<PaymentMultiple[]>([]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set(
        "ticket_sales_temporary",
        JSON.stringify(ticketSalesTemporaryOrigin),
      );
      formData.set("promo_code", searchParams.get("promoCode") ?? "");
      formData.set("booklet_code", searchParams.get("bookletCode") ?? "");
      formData.append("payments", JSON.stringify(payments));

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
      if (sessionStorage.getItem("ticket-booklet-promo-sales-temporary"))
        sessionStorage.removeItem("ticket-booklet-promo-sales-temporary");

      redirect(state.url ?? "");
    }
  }, [state]);

  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-8">
      <div className="spcey-4 border-b-2 border-dashed pb-4">
        <div className="flex justify-between">
          <Label className="font-normal">Subtotal</Label>
          <div>
            {formatNumberToCurrency(ticketSalesTemporaryOrigin.total_gross)}
          </div>
        </div>
        <div className="flex justify-between pt-4">
          <Label className="font-normal">Discount</Label>
          <div>
            {formatNumberToCurrency(ticketSalesTemporaryOrigin.discount_amount)}
          </div>
        </div>
        <div className="flex justify-between">
          <Label className="font-normal">
            Pajak ({ticketSalesTemporaryOrigin.tax_percent}%)
          </Label>
          <div>
            {formatNumberToCurrency(ticketSalesTemporaryOrigin.tax_amount)}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex justify-between">
          <Label className="font-bold">Total Deposit</Label>
          <div className="font-bold">
            {formatNumberToCurrency(ticketSalesTemporaryOrigin.total_deposit)}
          </div>
        </div>

        <div className="flex justify-between">
          <Label className="text-xl font-bold">Total Pembayaran</Label>
          <div className="text-xl font-bold">
            {formatNumberToCurrency(ticketSalesTemporaryOrigin.grand_total)}
          </div>
        </div>

        <FormMultiplePayments
          payments={payments}
          setPayments={setPayments}
          grandTotal={ticketSalesTemporaryOrigin.grand_total}
          state={state}
          paymentMethodList={getPaymentMethod()}
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          className="flex items-center justify-center gap-2"
        >
          <Printer />
          <span>Cetak Struk</span>
        </Button>
        <ButtonDeleteTicketSalesTemporary
          ticketSalesTemporary={ticketSalesTemporaryOrigin}
        />
      </div>
    </form>
  );
}
