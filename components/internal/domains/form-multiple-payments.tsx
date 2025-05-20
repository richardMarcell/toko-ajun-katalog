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
import { formatNumberToCurrency } from "@/lib/utils";
import { ServerActionResponse } from "@/types/domains/server-action";
import { PaymentMultiple } from "@/types/payment-multiple";
import { Dispatch, SetStateAction, useState } from "react";
import ValidationErrorMessage from "../ValidationErrorMessage";
import PaymentCashQForm from "./payment/payment-cash-q-form";
import PaymentCreditCardQForm from "./payment/payment-credit-card-form";
import PaymentDebitForm from "./payment/payment-debit-form";
import PaymentQVoucherForm from "./payment/payment-q-voucher-form";
import PaymentQrisForm from "./payment/payment-qris-form";
import PaymentTransferBillForm from "./payment/payment-transfer-bill-form";
import PaymentTunaiForm from "./payment/payment-tunai-form";

type GeneralAcceptedPaymentMethod =
  | PaymentMethodEnum.TUNAI
  | PaymentMethodEnum.DEBIT
  | PaymentMethodEnum.CASH_Q
  | PaymentMethodEnum.QRIS
  | PaymentMethodEnum.CREDIT_CARD
  | PaymentMethodEnum.TRANSFER_BILL
  | PaymentMethodEnum.Q_VOUCHER;

function buildNewPaymentState(
  method: GeneralAcceptedPaymentMethod,
): PaymentMultiple {
  switch (method) {
    case PaymentMethodEnum.TUNAI:
      return { method, total_payment: 0 };
    case PaymentMethodEnum.DEBIT:
      return {
        method,
        total_payment: 0,
        cardholder_name: "",
        debit_card_number: "",
        debit_issuer_bank: "",
        referenced_id: "",
      };
    case PaymentMethodEnum.CASH_Q:
      return {
        method,
        total_payment: 0,
        wristband_code: "",
      };
    case PaymentMethodEnum.QRIS:
      return {
        method,
        total_payment: 0,
        qris_issuer: "",
      };
    case PaymentMethodEnum.CREDIT_CARD:
      return {
        method,
        total_payment: 0,
        credit_card_number: "",
      };
    case PaymentMethodEnum.TRANSFER_BILL:
      return {
        method,
        total_payment: 0,
        room_number: "",
      };
    case PaymentMethodEnum.Q_VOUCHER:
      return {
        method,
        total_payment: 0,
        q_voucher_codes: [],
      };
    default:
      return {
        method,
        total_payment: 0,
      };
  }
}

export default function FormMultiplePayments({
  payments,
  setPayments,
  grandTotal,
  state,
  paymentMethodList,
  isDisplayRemainingBalance = true,
}: {
  payments: PaymentMultiple[];
  setPayments: Dispatch<SetStateAction<PaymentMultiple[]>>;
  grandTotal: number;
  state: ServerActionResponse;
  paymentMethodList: PaymentMethodEnum[];
  isDisplayRemainingBalance?: boolean;
}) {
  const [paymentMethod, setPaymentMethod] = useState<
    GeneralAcceptedPaymentMethod | ""
  >("");

  function onPaymentFieldChange<T extends PaymentMultiple, K extends keyof T>(
    method: PaymentMethodEnum,
    field: K,
    value: T[K],
  ): void {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.method === method
          ? {
              ...payment,
              [field]: value,
            }
          : payment,
      ),
    );
  }

  function handleAddPayment() {
    if (paymentMethod === "") return;

    const newPayment = buildNewPaymentState(paymentMethod);

    setPayments((prev) =>
      prev.some((p) => p.method === newPayment.method)
        ? prev
        : [...prev, newPayment],
    );
  }

  function handleRemovePayment(method: PaymentMethodEnum) {
    setPayments((prev) => prev.filter((payment) => payment.method !== method));
  }

  const totalPaid = payments.reduce(
    (sum, payment) => sum + (payment.total_payment ?? 0),
    0,
  );

  const remainingBalance = totalPaid - grandTotal;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="space-y-2">
          <div>
            <Label>Metode Pembayaran</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="mt-4 flex gap-4">
            <Select
              onValueChange={(paymentMethod: GeneralAcceptedPaymentMethod) =>
                setPaymentMethod(paymentMethod)
              }
            >
              <SelectTrigger
                className="w-full bg-white"
                data-testid="combobox-payment-method"
              >
                <SelectValue placeholder="Pilih metode pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {paymentMethodList.map((paymentMethod, index) => {
                    return (
                      <SelectItem key={index} value={paymentMethod}>
                        {getPaymentMethodCase(paymentMethod)}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              className="bg-qubu_green hover:bg-qubu_green/80"
              onClick={handleAddPayment}
              type="button"
              disabled={paymentMethod === ""}
            >
              Tambah Pembayaran
            </Button>
          </div>
          {state.errors?.payments && (
            <ValidationErrorMessage
              errorMessage={state.errors.payments.toString()}
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        {payments.map((payment) => {
          switch (payment.method) {
            case PaymentMethodEnum.TUNAI:
              return (
                <PaymentTunaiForm
                  payment={payment}
                  remainingBalance={remainingBalance}
                  onPaymentFieldChange={onPaymentFieldChange}
                  onRemove={handleRemovePayment}
                  state={state}
                  key={payment.method}
                />
              );

            case PaymentMethodEnum.DEBIT:
              return (
                <PaymentDebitForm
                  payment={payment}
                  remainingBalance={remainingBalance}
                  onPaymentFieldChange={onPaymentFieldChange}
                  onRemove={handleRemovePayment}
                  state={state}
                  key={payment.method}
                />
              );

            case PaymentMethodEnum.CASH_Q:
              return (
                <PaymentCashQForm
                  payment={payment}
                  remainingBalance={remainingBalance}
                  onPaymentFieldChange={onPaymentFieldChange}
                  onRemove={handleRemovePayment}
                  state={state}
                  key={payment.method}
                />
              );

            case PaymentMethodEnum.QRIS:
              return (
                <PaymentQrisForm
                  payment={payment}
                  remainingBalance={remainingBalance}
                  onPaymentFieldChange={onPaymentFieldChange}
                  onRemove={handleRemovePayment}
                  state={state}
                  key={payment.method}
                />
              );

            case PaymentMethodEnum.CREDIT_CARD:
              return (
                <PaymentCreditCardQForm
                  payment={payment}
                  remainingBalance={remainingBalance}
                  onPaymentFieldChange={onPaymentFieldChange}
                  onRemove={handleRemovePayment}
                  state={state}
                  key={payment.method}
                />
              );

            case PaymentMethodEnum.TRANSFER_BILL:
              return (
                <PaymentTransferBillForm
                  payment={payment}
                  remainingBalance={remainingBalance}
                  onPaymentFieldChange={onPaymentFieldChange}
                  onRemove={handleRemovePayment}
                  state={state}
                  key={payment.method}
                />
              );

            case PaymentMethodEnum.Q_VOUCHER:
              return (
                <PaymentQVoucherForm
                  payment={payment}
                  onPaymentFieldChange={onPaymentFieldChange}
                  onRemove={handleRemovePayment}
                  state={state}
                  key={payment.method}
                />
              );

            default:
              return;
          }
        })}
      </div>
      {isDisplayRemainingBalance && (
        <div className="space-y-2 pt-4">
          <div className="flex justify-between">
            <Label className="text-xl font-bold">Sisa Tagihan</Label>
            <div className="text-xl font-bold">
              {formatNumberToCurrency(
                remainingBalance < 0 ? remainingBalance : 0,
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <Label className="text-xl font-bold">Kembalian</Label>
            <div className="text-xl font-bold">
              {formatNumberToCurrency(
                remainingBalance >= 0 ? remainingBalance : 0,
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
