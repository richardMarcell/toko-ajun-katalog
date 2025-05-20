"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getPaymentMethodCase,
  PaymentMethodEnum,
} from "@/lib/enums/PaymentMethodEnum";
import getQVoucherValue from "@/lib/services/payments/get-q-voucher-value";
import { formatNumberToCurrency } from "@/lib/utils";
import { ServerActionResponse } from "@/types/domains/server-action";
import { PaymentMultiple, PaymentQVoucher } from "@/types/payment-multiple";
import { ChangeEvent, useRef } from "react";
import ValidationErrorMessage from "../../ValidationErrorMessage";

export default function PaymentQVoucherForm({
  payment,
  onPaymentFieldChange,
  onRemove,
  state,
}: {
  payment: PaymentMultiple;
  onPaymentFieldChange: <K extends keyof PaymentQVoucher>(
    method: PaymentMethodEnum,
    field: K,
    value: PaymentQVoucher[K],
  ) => void;
  onRemove: (method: PaymentMethodEnum) => void;
  state: ServerActionResponse;
}) {
  const lastInputRef = useRef<HTMLInputElement | null>(null);

  const vouchers =
    payment.method === PaymentMethodEnum.Q_VOUCHER
      ? getQVoucherValue(payment.q_voucher_codes ?? [])
      : [];

  const handleChangeVoucherCode = (
    event: ChangeEvent<HTMLInputElement>,
    payment: PaymentQVoucher,
    index: number,
  ) => {
    const newCode = event.target.value;

    const updatedCodes = [...(payment.q_voucher_codes ?? [])];
    updatedCodes[index] = newCode;

    const cleanedCodesForCalculation = updatedCodes.filter(
      (code) => code.trim() !== "",
    );
    const vouchers = getQVoucherValue(cleanedCodesForCalculation);
    const totalVoucherValue = vouchers.reduce((sum, v) => sum + v.value, 0);

    onPaymentFieldChange(payment.method, "q_voucher_codes", updatedCodes);
    onPaymentFieldChange(payment.method, "total_payment", totalVoucherValue);
  };

  const handleClickHapusVoucherCode = (
    payment: PaymentQVoucher,
    index: number,
  ) => {
    const updatedCodes = [...(payment.q_voucher_codes ?? [])];
    updatedCodes.splice(index, 1);

    const cleanedCodes = updatedCodes.filter(
      (voucherCode) => voucherCode.trim() !== "",
    );
    const vouchers = getQVoucherValue(cleanedCodes);
    const totalVoucherValue = vouchers.reduce(
      (sum, voucher) => sum + voucher.value,
      0,
    );

    onPaymentFieldChange(payment.method, "q_voucher_codes", updatedCodes);
    onPaymentFieldChange(payment.method, "total_payment", totalVoucherValue);
  };

  const handleClickTambahVoucher = (payment: PaymentQVoucher) => {
    const updatedCodes = [...(payment.q_voucher_codes ?? []), ""];
    onPaymentFieldChange(payment.method, "q_voucher_codes", updatedCodes);

    setTimeout(() => {
      lastInputRef.current?.focus();
    }, 0);
  };

  return (
    <div key={PaymentMethodEnum.Q_VOUCHER} className="rounded-md border p-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">
          {getPaymentMethodCase(PaymentMethodEnum.Q_VOUCHER)}
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
        <div className="col-span-2 space-y-2">
          <Label>
            Kode Voucher <span className="text-red-500">*</span>
          </Label>

          <div className="space-y-2">
            {payment.method === PaymentMethodEnum.Q_VOUCHER &&
              (payment.q_voucher_codes ?? []).map((code, index) => {
                const voucher = vouchers[index];

                return (
                  <div
                    key={`voucher-${index}`}
                    className="flex items-center gap-2"
                  >
                    <Input
                      type="text"
                      placeholder={`Kode voucher ${index + 1}`}
                      value={code}
                      onChange={(event) => {
                        handleChangeVoucherCode(event, payment, index);
                      }}
                      ref={
                        index === (payment.q_voucher_codes?.length ?? 0) - 1
                          ? lastInputRef
                          : null
                      }
                    />
                    <div className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm md:text-sm">
                      <p className="my-auto w-full text-right">
                        {formatNumberToCurrency(voucher.value ?? 0)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleClickHapusVoucherCode(payment, index)
                      }
                    >
                      Hapus
                    </Button>
                  </div>
                );
              })}
          </div>

          {payment.method === PaymentMethodEnum.Q_VOUCHER && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => handleClickTambahVoucher(payment)}
            >
              + Tambah Voucher
            </Button>
          )}

          {state.errors?.q_voucher_codes && (
            <ValidationErrorMessage
              errorMessage={state.errors.q_voucher_codes.toString()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
