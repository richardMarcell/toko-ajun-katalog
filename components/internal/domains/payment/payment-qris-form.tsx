"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getPaymentMethodCase,
  PaymentMethodEnum,
} from "@/lib/enums/PaymentMethodEnum";
import { getQrisIssuerCase, QrisIssuerEnum } from "@/lib/enums/QrisIssuerEnum";
import { ServerActionResponse } from "@/types/domains/server-action";
import { PaymentMultiple, PaymentQris } from "@/types/payment-multiple";
import { useEffect, useState } from "react";
import InputMoney from "../../InputMoney";
import ValidationErrorMessage from "../../ValidationErrorMessage";

export default function PaymentQrisForm({
  payment,
  remainingBalance,
  onPaymentFieldChange,
  onRemove,
  state,
}: {
  payment: PaymentMultiple;
  remainingBalance: number;
  onPaymentFieldChange: <K extends keyof PaymentQris>(
    method: PaymentMethodEnum,
    field: K,
    value: PaymentQris[K],
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
    <div key={PaymentMethodEnum.QRIS} className="rounded-md border p-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">
          {getPaymentMethodCase(PaymentMethodEnum.QRIS)}
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

        <div className="space-y-2">
          <div>
            <Label>Penyedia Qris</Label>
            <span className="text-red-500">*</span>
          </div>
          <Select
            name="qris_issuer"
            onValueChange={(value) =>
              onPaymentFieldChange(payment.method, "qris_issuer", value)
            }
          >
            <SelectTrigger className="mt-4 w-full bg-white">
              <SelectValue placeholder="Pilih penyedia Qris" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(QrisIssuerEnum).map((issuer) => {
                  return (
                    <SelectItem key={issuer} value={issuer}>
                      {getQrisIssuerCase(issuer)}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          {state.errors?.qris_issuer && (
            <ValidationErrorMessage
              errorMessage={state.errors.qris_issuer.toString()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
