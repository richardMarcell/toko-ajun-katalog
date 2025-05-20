"use client";

import { storeSalesMultiplePayments } from "@/app/(main)/pos/food-corner/sales/create/_actions/store-sales-multiple-payments";
import FormMultiplePayments from "@/components/internal/domains/form-multiple-payments";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatNumberToCurrency } from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { SalesTemporary } from "@/types/domains/pos/food-corner/sales/create";
import { PaymentMultiple } from "@/types/payment-multiple";
import { Promo } from "@/types/promo";
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
import { ButtonDeleteSalesTemporary } from "./button-delete-sales-temporary";
import { SelectOptionsPromoCode } from "./select-options-promo-code";
import getPaymentMethod from "@/lib/services/payments/get-payment-method";

export function FormCreateSales({
  salesTemporary,
  promoList,
}: {
  salesTemporary: SalesTemporary;
  promoList: Promo[];
}) {
  const [state, formAction] = useActionState(
    // storeSalesSinglePayment,
    storeSalesMultiplePayments,
    initialValue,
  );

  const [salesTemporaryToDisplay, setSalesTemporaryToDisplay] =
    useState<SalesTemporary>(salesTemporary);
  const [promoCode, setPromoCode] = useState<string>("");
  const [payments, setPayments] = useState<PaymentMultiple[]>([]);

  const updatePromoCode = ({ code }: { code: string }) => {
    setPromoCode(code);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("promo_code", promoCode);
      formData.append("sales_temporary_origin", JSON.stringify(salesTemporary));

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
            {formatNumberToCurrency(salesTemporaryToDisplay.total_gross)}
          </div>
        </div>
        <div className="flex items-end justify-between">
          <SelectOptionsPromoCode
            salesTemporaryToDisplay={salesTemporaryToDisplay}
            salesTemporaryOrigin={salesTemporary}
            setSalesTemporaryToDisplay={setSalesTemporaryToDisplay}
            promoCode={promoCode}
            updatePromoCode={updatePromoCode}
            promoList={promoList}
          />
          <div>
            {formatNumberToCurrency(salesTemporaryToDisplay.discount_amount)}
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <Label className="font-normal">
            Pajak Daerah ({salesTemporaryToDisplay.tax_percent}%)
          </Label>
          <div>
            {formatNumberToCurrency(salesTemporaryToDisplay.tax_amount)}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex justify-between">
          <Label className="text-xl font-bold">Total Pembayaran</Label>
          <div
            className="text-xl font-bold"
            data-testid="total-payment-display"
          >
            {formatNumberToCurrency(salesTemporaryToDisplay.grand_total)}
          </div>
        </div>

        {/* <FormSinglePayment
          payment={payment}
          setPayment={setPayment}
          grandTotal={salesTemporaryToDisplay.grand_total}
          state={state}
        /> */}

        <FormMultiplePayments
          payments={payments}
          setPayments={setPayments}
          grandTotal={salesTemporaryToDisplay.grand_total}
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
        <ButtonDeleteSalesTemporary />
      </div>
    </form>
  );
}
