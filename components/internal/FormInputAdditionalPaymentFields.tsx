import {
  DebitIssuerBankEnum,
  getDebitIssuerBankCase,
} from "@/lib/enums/DebitIssuerBankEnum";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { getQrisIssuerCase, QrisIssuerEnum } from "@/lib/enums/QrisIssuerEnum";
import { ServerActionResponse } from "@/types/domains/server-action";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ValidationErrorMessage from "./ValidationErrorMessage";

export function FormInputAdditionalPaymentFields({
  paymentMethod,
  state,
}: {
  paymentMethod: PaymentMethodEnum;
  state: ServerActionResponse;
}) {
  if (paymentMethod === PaymentMethodEnum.DEBIT) {
    return (
      <div className="col-span-2 grid grid-cols-4 gap-4">
        <div className="space-y-2">
          <div>
            <Label htmlFor="cardholder_name">Bank</Label>
            <span className="text-red-500">*</span>
          </div>

          <Select name="debit_issuer_bank">
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
          />
          {state.errors?.referenced_id && (
            <ValidationErrorMessage
              errorMessage={state.errors.referenced_id.toString()}
            />
          )}
        </div>
      </div>
    );
  }

  if (paymentMethod === PaymentMethodEnum.CASH_Q) {
    return (
      <div className="col-span-2 space-y-2">
        <div>
          <Label htmlFor="wristband_code">Kode CashQ</Label>
          <span className="text-red-500">*</span>
        </div>

        <Input
          id="wristband_code"
          name="wristband_code"
          type="text"
          placeholder="Masukkan kode gelang"
          autoComplete="off"
        />
        {state.errors?.wristband_code && (
          <ValidationErrorMessage
            errorMessage={state.errors.wristband_code.toString()}
          />
        )}
      </div>
    );
  }

  if (paymentMethod === PaymentMethodEnum.CREDIT_CARD) {
    return (
      <div className="col-span-2 space-y-2">
        <div>
          <Label htmlFor="credit_card_number">Nomor Kartu</Label>
          <span className="text-red-500">*</span>
        </div>

        <Input
          id="credit_card_number"
          name="credit_card_number"
          type="text"
          placeholder="Masukkan nomor kartu"
          autoComplete="off"
        />
        {state.errors?.credit_card_number && (
          <ValidationErrorMessage
            errorMessage={state.errors.credit_card_number.toString()}
          />
        )}
      </div>
    );
  }

  if (paymentMethod === PaymentMethodEnum.QRIS) {
    return (
      <div className="col-span-2 space-y-2">
        <div>
          <Label>Penyedia Qris</Label>
          <span className="text-red-500">*</span>
        </div>
        <Select name="qris_issuer">
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
    );
  }
}
