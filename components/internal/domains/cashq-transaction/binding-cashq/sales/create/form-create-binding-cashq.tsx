"use client";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNumberToCurrency } from "@/lib/utils";
import { ServerActionResponse } from "@/types/domains/server-action";
import { Dispatch, SetStateAction } from "react";
import { BindingCashQ } from "./panel-binding-cashq";
import FormMultiplePayments from "@/components/internal/domains/form-multiple-payments";
import getPaymentMethod from "@/lib/services/payments/get-payment-method";
import { PaymentMultiple } from "@/types/payment-multiple";

export default function FormCreateBindingCashQ({
  state,
  bindingCashQ,
  setBindingCashQ,
  payments,
  setPayments,
}: {
  state: ServerActionResponse;
  bindingCashQ: BindingCashQ;
  setBindingCashQ: Dispatch<SetStateAction<BindingCashQ>>;
  payments: PaymentMultiple[];
  setPayments: Dispatch<SetStateAction<PaymentMultiple[]>>;
}) {
  return (
    <div className="pt-8">
      <div className="flex justify-between">
        <div>
          <p>Gelang</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={bindingCashQ.quantity == 0}
            onClick={() =>
              setBindingCashQ((prevState) => ({
                ...prevState,
                quantity: bindingCashQ.quantity - 1,
              }))
            }
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border p-[10px] font-bold disabled:bg-gray-100"
          >
            {"-"}
          </button>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-gray-100 p-[10px] font-bold">
            {bindingCashQ.quantity}
          </div>

          <button
            onClick={() =>
              setBindingCashQ((prevState) => ({
                ...prevState,
                quantity: bindingCashQ.quantity + 1,
              }))
            }
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border bg-qubu_blue p-[10px] font-bold text-white"
          >
            {"+"}
          </button>
        </div>
        <Input
          type="text"
          className="w-56 text-right"
          autoComplete="off"
          value={formatNumberToCurrency(bindingCashQ.deposit_amount)}
          disabled
        />
      </div>
      <div className="grid gap-4 pt-4">
        {Array.from({ length: bindingCashQ.quantity }).map((_, index) => (
          <div className="space-y-2" key={index}>
            <div>
              <Label htmlFor={`wristband_code_list[${index}]`}>
                #{index + 1} CashQ Code
              </Label>
              <span className="text-qubu_red">*</span>
            </div>
            <Input
              placeholder="Masukkan Kode CashQ"
              id={`wristband_code_list_${index}`}
              name={`wristband_code_list[${index}]`}
              defaultValue={bindingCashQ.wristband_code_list[index]}
              autoComplete="off"
              onChange={(event) => {
                const newWristbandCodeList = [
                  ...bindingCashQ.wristband_code_list,
                ];
                newWristbandCodeList[index] = event.target.value;
                setBindingCashQ((prevState) => ({
                  ...prevState,
                  wristband_code_list: newWristbandCodeList,
                }));
              }}
            />
            {state.errors?.wristband_code_list && (
              <div>
                <ValidationErrorMessage
                  errorMessage={state.errors.wristband_code_list.toString()}
                />
              </div>
            )}
            {renderDynamicInputValidationError(
              state.errors,
              `wristband_code_list[${index}]`,
            )}
          </div>
        ))}
      </div>

      <FormMultiplePayments
        payments={payments}
        setPayments={setPayments}
        grandTotal={bindingCashQ.deposit_amount}
        state={state}
        paymentMethodList={getPaymentMethod()}
        isDisplayRemainingBalance={false}
      />
    </div>
  );
}

function renderDynamicInputValidationError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: Record<string, any> | undefined,
  name: string,
) {
  const errorObject = errors || {};

  return Object.keys(errorObject).map((key) => {
    if (key.includes(name)) {
      return (
        <ValidationErrorMessage
          key={key}
          errorMessage={errorObject[key].toString()}
        />
      );
    }
    return null;
  });
}
