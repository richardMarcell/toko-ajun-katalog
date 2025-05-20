"use client";

import { calculatePromo } from "@/app/(main)/pos/souvenir/sales/create/_actions/calculate-promo";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import {
  Payment,
  SalesTemporary,
} from "@/types/domains/pos/locker/sales/create";
import { ServerActionResponse } from "@/types/domains/server-action";
import { BaseSyntheticEvent, Dispatch, SetStateAction, useState } from "react";

export function InputPromoCode({
  salesTemporaryOrigin,
  salesTemporaryToDisplay,
  setSalesTemporaryToDisplay,
  payment,
  setPayment,
}: {
  salesTemporaryOrigin: SalesTemporary;
  salesTemporaryToDisplay: SalesTemporary;
  setSalesTemporaryToDisplay: Dispatch<SetStateAction<SalesTemporary>>;
  payment: Payment;
  setPayment: Dispatch<SetStateAction<Payment>>;
}) {
  const [state, setState] = useState<ServerActionResponse>(initialValue);
  const [isPromoApplied, setIsPromoApplied] = useState<boolean>(false);

  const handleButtonApplyOnClick = async () => {
    const formData = new FormData();
    formData.append("sales_temporary", JSON.stringify(salesTemporaryToDisplay));
    formData.append("promo_code", payment.promo_code);

    const response = await calculatePromo(formData);

    if (response.status === "success" && response.data) {
      setPayment({
        ...payment,
        total_payment: 0,
        change_amount: 0,
      });
      setSalesTemporaryToDisplay(response.data);
      setIsPromoApplied(true);
    }

    setState(response);
  };

  const handleButtonCancelOnClick = () => {
    setSalesTemporaryToDisplay(salesTemporaryOrigin);
    setIsPromoApplied(false);
    setPayment({
      promo_code: "",
      total_payment: 0,
      change_amount: 0,
      method: "",
    });
  };

  return (
    <div className="w-1/2 space-y-2">
      <Label className="font-normal">Discount</Label>
      <div className="flex gap-2">
        <Input
          type="text"
          className="w-full"
          placeholder="Masukkan kode promo"
          autoComplete="off"
          onChange={(e: BaseSyntheticEvent) =>
            setPayment({ ...payment, promo_code: e.target.value })
          }
          value={payment.promo_code}
          disabled={isPromoApplied}
        />

        <Button
          onClick={handleButtonApplyOnClick}
          type="button"
          className="bg-qubu_blue"
          disabled={isPromoApplied}
        >
          Apply
        </Button>

        {isPromoApplied && (
          <Button
            onClick={handleButtonCancelOnClick}
            type="button"
            variant={"destructive"}
          >
            Cancel
          </Button>
        )}
      </div>
      {state?.errors?.promo_code && (
        <ValidationErrorMessage
          errorMessage={state.errors.promo_code.toString()}
        />
      )}
    </div>
  );
}
