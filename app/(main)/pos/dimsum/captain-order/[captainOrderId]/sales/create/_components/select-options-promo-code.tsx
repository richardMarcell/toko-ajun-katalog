"use client";

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
import { Promo } from "@/types/promo";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { calculatePromo } from "../_actions/calculate-promo";

type SaleDetail = {
  captain_order_detail_id: number;
  product_id: number;
  product_name: string;
  qty: number;
  price: number;
  note?: string | null;
};

type DimsumSalesTemporary = {
  captain_order_id: number;
  sales_details: SaleDetail[];
  total_gross: number;
  total_net: number;
  grand_total: number;
  tax_percent: number;
  tax_amount: number;
  discount_percent: number;
  discount_amount: number;
  created_at: Date;
  promo_code: string;
};

export function SelectOptionsPromoCode({
  dimsumSalesTemporaryOrigin,
  setDimsumSalesTemporaryToDisplay,
  promoCode,
  updatePromoCode,
  promoList,
}: {
  dimsumSalesTemporaryOrigin: DimsumSalesTemporary;
  setDimsumSalesTemporaryToDisplay: Dispatch<
    SetStateAction<DimsumSalesTemporary>
  >;
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
    formData.append(
      "dimsum_sales_temporary",
      JSON.stringify(dimsumSalesTemporaryOrigin),
    );
    formData.append("promo_code", value);

    const response = await calculatePromo(formData);

    if (response.status === "success" && response.data) {
      updatePromoCode({ code: value });
      setDimsumSalesTemporaryToDisplay(response.data);
      setIsPromoApplied(true);
    }

    setState(response);
  };

  const handleButtonCancelOnClick = () => {
    setDimsumSalesTemporaryToDisplay(dimsumSalesTemporaryOrigin);
    setIsPromoApplied(false);
    updatePromoCode({ code: "" });
  };

  useEffect(() => {
    if (promoCode && !isPromoApplied) {
      handleOptionOnChange(promoCode);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-1/2 space-y-2">
      <Label className="font-normal">Discount</Label>
      <div className="flex gap-2">
        <Select
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
