"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DebitIssuerBankEnum,
  getDebitIssuerBankCase,
} from "@/lib/enums/DebitIssuerBankEnum";
import {
  getPaymentMethodCase,
  PaymentMethodEnum,
} from "@/lib/enums/PaymentMethodEnum";
import { ServerActionResponse } from "@/types/domains/server-action";
import { PaymentDebit, PaymentMultiple } from "@/types/payment-multiple";
import { useEffect, useState } from "react";
import InputMoney from "../../InputMoney";
import ValidationErrorMessage from "../../ValidationErrorMessage";

export default function PaymentDebitForm({
  payment,
  remainingBalance,
  onPaymentFieldChange,
  onRemove,
  state,
}: {
  payment: PaymentMultiple;
  remainingBalance: number;
  onPaymentFieldChange: <K extends keyof PaymentDebit>(
    method: PaymentMethodEnum,
    field: K,
    value: PaymentDebit[K],
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
    <div key={PaymentMethodEnum.DEBIT} className="rounded-md border p-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">
          {getPaymentMethodCase(PaymentMethodEnum.DEBIT)}
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
        </div>

        <div className="col-span-3"></div>

        <div className="space-y-2">
          <div>
            <Label htmlFor="cardholder_name">Bank</Label>
            <span className="text-red-500">*</span>
          </div>

          <Select
            name="debit_issuer_bank"
            onValueChange={(value) =>
              onPaymentFieldChange(payment.method, "debit_issuer_bank", value)
            }
          >
            <SelectTrigger className="mt-4 w-full bg-white">
              <SelectValue placeholder="Pilih Bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(DebitIssuerBankEnum).map((issuer) => {
                  return (
                    <SelectItem key={issuer} value={issuer}>
                      {getDebitIssuerBankCase(issuer)}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          {state.errors?.debit_issuer_bank && (
            <ValidationErrorMessage
              errorMessage={state.errors.debit_issuer_bank.toString()}
            />
          )}
        </div>

        <div className="space-y-2">
          <div>
            <Label htmlFor="cardholder_name">Pengguna Kartu</Label>
            <span className="text-red-500">*</span>
          </div>

          <Input
            id="cardholder_name"
            autoComplete="off"
            name="cardholder_name"
            type="text"
            placeholder="Masukkan pengguna kartu"
            onChange={(event) =>
              onPaymentFieldChange(
                payment.method,
                "cardholder_name",
                event.target.value,
              )
            }
          />
          {state.errors?.cardholder_name && (
            <ValidationErrorMessage
              errorMessage={state.errors.cardholder_name.toString()}
            />
          )}
        </div>

        <div className="space-y-2">
          <div>
            <Label htmlFor="card_number">Nomor Kartu</Label>
            <span className="text-red-500">*</span>
          </div>

          <Input
            id="debit_card_number"
            autoComplete="off"
            name="debit_card_number"
            type="text"
            placeholder="Masukkan nomor kartu"
            onChange={(event) =>
              onPaymentFieldChange(
                payment.method,
                "debit_card_number",
                event.target.value,
              )
            }
          />
          {state.errors?.debit_card_number && (
            <ValidationErrorMessage
              errorMessage={state.errors.debit_card_number.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <div>
            <Label htmlFor="referenced_id">Referenced ID</Label>
            <span className="text-red-500">*</span>
          </div>

          <Input
            id="referenced_id"
            autoComplete="off"
            name="referenced_id"
            type="text"
            placeholder="Masukkan referenced id"
            onChange={(event) =>
              onPaymentFieldChange(
                payment.method,
                "referenced_id",
                event.target.value,
              )
            }
          />
          {state.errors?.referenced_id && (
            <ValidationErrorMessage
              errorMessage={state.errors.referenced_id.toString()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
