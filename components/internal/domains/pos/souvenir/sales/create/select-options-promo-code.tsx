"use client";

import { calculatePromo } from "@/app/(main)/pos/souvenir/sales/create/_actions/calculate-promo";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { SalesTemporary } from "@/types/domains/pos/souvenir/sales/create";
import { Promo } from "@/types/promo";
import { Dispatch, SetStateAction, useState } from "react";

export function SelectOptionsPromoCode({
  salesTemporaryOrigin,
  salesTemporaryToDisplay,
  setSalesTemporaryToDisplay,
  promoCode,
  updatePromoCode,
  promoList,
}: {
  salesTemporaryOrigin: SalesTemporary;
  salesTemporaryToDisplay: SalesTemporary;
  setSalesTemporaryToDisplay: Dispatch<SetStateAction<SalesTemporary>>;
  promoCode: string;
  updatePromoCode: ({ code }: { code: string }) => void;
  promoList: Promo[];
}) {
  const [state, setState] = useState<{
    message: string;
    status: string;
    errors?: { [key: string]: string };
  }>(initialValue);
  const [isPromoApplied, setIsPromoApplied] = useState<boolean>(false);

  const handleOptionOnChange = async (value: string) => {
    const formData = new FormData();
    formData.append("sales_temporary", JSON.stringify(salesTemporaryToDisplay));
    formData.append("promo_code", value);

    const response = await calculatePromo(formData);

    if (response.status === "success" && response.data) {
      updatePromoCode({ code: value });
      setSalesTemporaryToDisplay(response.data);
      setIsPromoApplied(true);
    }

    setState(response);
  };

  const handleButtonCancelOnClick = () => {
    setSalesTemporaryToDisplay(salesTemporaryOrigin);
    setIsPromoApplied(false);
    updatePromoCode({ code: "" });
  };

  return (
    <div className="w-1/2 space-y-2">
      <Label className="font-normal">Discount</Label>
      <div className="flex gap-2">
        <Select
          name="promo_code"
          value={promoCode}
          onValueChange={handleOptionOnChange}
          disabled={isPromoApplied}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih promo" />
          </SelectTrigger>
          <SelectContent>
            {promoList.map((promo) => {
              return (
                <SelectItem key={promo.code} value={promo.code.toString()}>
                  {promo.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

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
