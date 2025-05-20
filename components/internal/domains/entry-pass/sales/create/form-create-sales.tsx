"use client";

import { storeSales } from "@/app/(main)/entry-pass/sales/create/_actions/store-sales";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import getPaymentMethod from "@/lib/services/payments/get-payment-method";
import { formatNumberToCurrency } from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { EntryPassCustomerHistoryIncludeRelations } from "@/types/domains/entry-pass/sales/create";
import { PaymentMultiple } from "@/types/payment-multiple";
import { Printer } from "lucide-react";
import { redirect } from "next/navigation";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import FormMultiplePayments from "../../../form-multiple-payments";
import { ButtonDeleteEntryPassCustomerHistory } from "./button-delete-entry-pass-customer-history";

export function FormCreateSales({
  entryPassCustomerHistory,
}: {
  entryPassCustomerHistory: EntryPassCustomerHistoryIncludeRelations;
}) {
  const [state, formAction] = useActionState(storeSales, initialValue);

  const [payments, setPayments] = useState<PaymentMultiple[]>([]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.append(
        "entry_pass_customer_history_id",
        entryPassCustomerHistory.id.toString(),
      );

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

    if (state.status == "success") redirect(state.url ?? "");
  }, [state]);

  return (
    <form onSubmit={onSubmit} className="pt-8">
      <div className="border-b-4 border-dashed pb-8">
        <div className="flex justify-between">
          <Label className="font-normal">Total</Label>
          <div>
            {formatNumberToCurrency(
              Number(entryPassCustomerHistory.product.price),
            )}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex justify-between">
          <Label className="text-xl font-bold">Total Pembayaran</Label>
          <div className="text-xl font-bold">
            {formatNumberToCurrency(
              Number(entryPassCustomerHistory.product.price),
            )}
          </div>
        </div>

        <FormMultiplePayments
          payments={payments}
          setPayments={setPayments}
          grandTotal={Number(entryPassCustomerHistory.product.price)}
          state={state}
          paymentMethodList={getPaymentMethod()}
        />
      </div>

      <div className="flex gap-2 pt-8">
        <Button
          type="submit"
          className="flex items-center justify-center gap-2"
        >
          <Printer />
          <span>Bayar & Cetak Struk</span>
        </Button>
        <ButtonDeleteEntryPassCustomerHistory
          entryPassCustomerHistory={entryPassCustomerHistory}
        />
      </div>
    </form>
  );
}
