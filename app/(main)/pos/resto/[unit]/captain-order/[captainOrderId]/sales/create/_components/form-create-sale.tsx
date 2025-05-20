"use client";

import FormMultiplePayments from "@/components/internal/domains/form-multiple-payments";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getPaymentMethodOnRestoPatio } from "@/lib/services/payments/get-payment-method";
import { formatNumberToCurrency } from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { PaymentMultiple } from "@/types/payment-multiple";
import { Promo } from "@/types/promo";
import { Printer } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { CaptainOrderIncludeRelationship } from "../../../edit/_types/edit";
import { storeSales } from "../_actions/store-sales";
import { ButtonDeleteRestoSalesTemporary } from "./button-delete-resto-sales-temporary";
import { SelectOptionsPromoCode } from "./select-options-promo-code";

type SaleDetail = {
  captain_order_detail_id: number;
  product_id: number;
  product_name: string;
  qty: number;
  price: number;
  note?: string | null;
};

type RestoSalesTemporary = {
  captain_order_id: number;
  sales_details: SaleDetail[];
  total_gross: number;
  total_net: number;
  grand_total: number;
  tax_percent: number;
  tax_amount: number;
  discount_percent: number;
  discount_amount: number;
  created_at: Date;
  promo_code: string;
};

export function FormCreateSales({
  captainOrder,
  promoList,
}: {
  captainOrder: CaptainOrderIncludeRelationship;
  promoList: Promo[];
}) {
  // TODO: fix this function to get from session storage cause on client to ready to read session storage
  const restoSalesTemporaryOrigin: RestoSalesTemporary = JSON.parse(
    sessionStorage.getItem(
      `resto-sales-temporary-${captainOrder.id}`,
    ) as string,
  );

  const [restoSalesTemporaryToDisplay, setRestoTemporaryToDisplay] =
    useState<RestoSalesTemporary>(restoSalesTemporaryOrigin);

  const [state, formAction] = useActionState(storeSales, initialValue);

  const [promoCode, setPromoCode] = useState<string>("");
  const [payments, setPayments] = useState<PaymentMultiple[]>([]);

  const updatePromoCode = ({ code }: { code: string }) => {
    setPromoCode(code);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: make sure promo code not applied when not selected
    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.append("promo_code", promoCode);
      formData.append("captain_order_id", captainOrder.id.toString());
      formData.append(
        "resto_sales_temporary",
        JSON.stringify(restoSalesTemporaryOrigin),
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

    if (state.status == "success" && state.url) {
      if (sessionStorage.getItem(`resto-sales-temporary-${captainOrder.id}`)) {
        sessionStorage.removeItem(`resto-sales-temporary-${captainOrder.id}`);
      }
      redirect(state.url);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!restoSalesTemporaryOrigin) return notFound();

  return (
    <form onSubmit={onSubmit} className="pt-8">
      <div className="border-b-4 border-dashed pb-8">
        <div className="flex justify-between">
          <Label className="font-normal">Total</Label>
          <div>
            {formatNumberToCurrency(restoSalesTemporaryToDisplay.total_gross)}
          </div>
        </div>
        <div className="flex items-end justify-between">
          <SelectOptionsPromoCode
            promoCode={promoCode}
            updatePromoCode={updatePromoCode}
            promoList={promoList}
            restoSalesTemporaryOrigin={restoSalesTemporaryOrigin}
            setRestoSalesTemporaryToDisplay={setRestoTemporaryToDisplay}
          />
          {formatNumberToCurrency(
            Number(restoSalesTemporaryToDisplay.discount_amount),
          )}
        </div>
        <div className="mt-4 flex justify-between">
          <Label className="font-normal">
            Pajak ({restoSalesTemporaryToDisplay.tax_percent}%)
          </Label>
          <div>
            {formatNumberToCurrency(
              Number(restoSalesTemporaryToDisplay.tax_amount),
            )}
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
            {formatNumberToCurrency(
              Number(restoSalesTemporaryToDisplay.grand_total),
            )}
          </div>
        </div>

        <FormMultiplePayments
          payments={payments}
          setPayments={setPayments}
          grandTotal={restoSalesTemporaryToDisplay.grand_total}
          state={state}
          paymentMethodList={getPaymentMethodOnRestoPatio()}
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
        <ButtonDeleteRestoSalesTemporary captainOrder={captainOrder} />
      </div>
    </form>
  );
}
