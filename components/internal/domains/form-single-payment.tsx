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
import getPaymentMethod from "@/lib/services/payments/get-payment-method";
import { formatNumberToCurrency } from "@/lib/utils";
import { Payment } from "@/types/domains/pos/food-corner/sales/create";
import { ServerActionResponse } from "@/types/domains/server-action";
import { Dispatch, Fragment, SetStateAction } from "react";
import { FormInputAdditionalPaymentFields } from "../FormInputAdditionalPaymentFields";
import InputMoney from "../InputMoney";
import ValidationErrorMessage from "../ValidationErrorMessage";

export default function FormSinglePayment({
  payment,
  setPayment,
  grandTotal,
  state,
}: {
  payment: Payment;
  setPayment: Dispatch<SetStateAction<Payment>>;
  grandTotal: number;
  state: ServerActionResponse;
}) {
  const onTotalPaymentChange = (totalPayment: number) => {
    const change = totalPayment - grandTotal;
    setPayment({
      ...payment,
      total_payment: totalPayment,
      change_amount: change > 0 ? change : 0,
    });
  };

  return (
    <Fragment>
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="space-y-2">
          <div>
            <Label>Metode Pembayaran</Label>
            <span className="text-red-500">*</span>
          </div>
          <Select
            onValueChange={(paymentMethod: string) =>
              setPayment({
                ...payment,
                method: paymentMethod,
                change_amount: 0,
                total_payment: 0,
              })
            }
            value={payment.method}
          >
            <SelectTrigger
              className="mt-4 w-full bg-white"
              data-testid="combobox-payment-method"
            >
              <SelectValue placeholder="Pilih metode pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {getPaymentMethod().map((paymentMethod, index) => {
                  return (
                    <SelectItem key={index} value={paymentMethod}>
                      {getPaymentMethodCase(paymentMethod)}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          {state.errors?.payment_method && (
            <ValidationErrorMessage
              errorMessage={state.errors.payment_method.toString()}
            />
          )}
        </div>

        {payment.method === PaymentMethodEnum.TUNAI && (
          <div className="space-y-2">
            <div>
              <Label>Pembayaran</Label>
              <span className="text-red-500">*</span>
            </div>

            <InputMoney
              id="total_payment"
              type="text"
              placeholder="Masukkan nominal pembayaran"
              value={payment.total_payment}
              onChange={(value) => onTotalPaymentChange(Number(value))}
              data-testid="input-total-payment"
            />
            {state.errors?.total_payment && (
              <ValidationErrorMessage
                errorMessage={state.errors.total_payment.toString()}
              />
            )}
          </div>
        )}

        <FormInputAdditionalPaymentFields
          paymentMethod={payment.method as PaymentMethodEnum}
          state={state}
        />
      </div>

      {payment.method === PaymentMethodEnum.TUNAI && (
        <div className="flex justify-between pt-4">
          <Label className="text-xl font-bold">Kembalian</Label>
          <div className="text-xl font-bold">
            {formatNumberToCurrency(payment.change_amount)}
          </div>
        </div>
      )}
    </Fragment>
  );
}
