"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  getPaymentMethodCase,
  PaymentMethodEnum,
} from "@/lib/enums/PaymentMethodEnum";
import { ServerActionResponse } from "@/types/domains/server-action";
import { PaymentMultiple, PaymentTunai } from "@/types/payment-multiple";
import { useEffect, useState } from "react";
import InputMoney from "../../InputMoney";
import ValidationErrorMessage from "../../ValidationErrorMessage";

export default function PaymentTunaiForm({
  payment,
  remainingBalance,
  onPaymentFieldChange,
  onRemove,
  state,
}: {
  payment: PaymentMultiple;
  remainingBalance: number;
  onPaymentFieldChange: <K extends keyof PaymentTunai>(
    method: PaymentMethodEnum,
    field: K,
    value: PaymentTunai[K],
  ) => void;
  onRemove: (method: PaymentMethodEnum) => void;
  state: ServerActionResponse;
}) {
  const [totalPayment, setTotalPayment] = useState<number>(
    Math.abs(remainingBalance),
  );

  useEffect(() => {
    const absBalance = Math.abs(remainingBalance);
    setTotalPayment(absBalance);

    onPaymentFieldChange(payment.method, "total_payment", absBalance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment.method]);

  return (
    <div key={PaymentMethodEnum.TUNAI} className="rounded-md border p-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">
          {getPaymentMethodCase(PaymentMethodEnum.TUNAI)}
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={() => onRemove(payment.method)}
        >
          Hapus
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-x-4 gap-y-2">
        <div className="space-y-2">
          <div>
            <Label>Nomial yang dibayar</Label>
            <span className="text-red-500">*</span>
          </div>
          <InputMoney
            value={totalPayment}
            type="text"
            placeholder="Masukkan nominal pembayaran"
            onChange={(value) => {
              setTotalPayment(Number(value));

              onPaymentFieldChange(
                payment.method,
                "total_payment",
                Number(value),
              );
            }}
            data-testid="input-total-payment"
          />
          {state.errors?.total_payment && (
            <ValidationErrorMessage
              errorMessage={state.errors.total_payment.toString()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
