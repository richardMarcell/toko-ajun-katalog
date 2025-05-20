"use client";
import InputMoney from "@/components/internal/InputMoney";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNumberToCurrency, roundCurrency } from "@/lib/utils";
import { ServerActionResponse } from "@/types/domains/server-action";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type TopUpCashQType = {
  amount: number;
  current_saldo: number;
  wristband_code: string;
};

export default function FormTopUpWallet({
  state,
  topUpWallet,
  setWristbandRent,
}: {
  state: ServerActionResponse;
  topUpWallet: TopUpCashQType;
  setWristbandRent: Dispatch<SetStateAction<TopUpCashQType>>;
}) {
  const [inputValue, setInputValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const rounded = roundCurrency(Number(inputValue));

      setWristbandRent((prevState) => ({
        ...prevState,
        amount: rounded,
      }));
    }, 700);

    return () => clearTimeout(timeout);
  }, [inputValue, setWristbandRent]);

  return (
    <div className="pt-8">
      <div className="flex gap-x-6 rounded-md border p-4">
        <Avatar className="flex h-16 w-16 items-center justify-center border-2 font-bold">
          <Image
            src="/assets/imgs/qubu-resort-icon.png"
            alt="CashQ Icon"
            width={100}
            height={100}
          ></Image>
        </Avatar>
        <p>CashQ</p>
      </div>
      <div className="grid gap-4 pt-4">
        <div className="space-y-2">
          <div>
            <Label htmlFor="wristband_code">CashQ Code</Label>
          </div>
          <Input
            placeholder="Masukkan CashQ code"
            id="wristband_code"
            name="wristband_code"
            defaultValue={topUpWallet.wristband_code}
            readOnly
            disabled
            autoComplete="off"
          />
          {state.errors?.wristband_code && (
            <ValidationErrorMessage
              errorMessage={state.errors.wristband_code.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <div>
            <Label htmlFor="current_saldo">Sisa Saldo</Label>
          </div>
          <Input
            placeholder="Masukkan sisa saldo"
            id="current_saldo"
            name="current_saldo"
            defaultValue={formatNumberToCurrency(topUpWallet.current_saldo)}
            readOnly
            disabled
            autoComplete="off"
          />
          {state.errors?.current_saldo && (
            <ValidationErrorMessage
              errorMessage={state.errors.current_saldo.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <div>
            <Label htmlFor="amount">Tambah Saldo</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              disabled={topUpWallet.amount === 0}
              onClick={() =>
                setWristbandRent((prevState) => ({
                  ...prevState,
                  amount: topUpWallet.amount - 10000,
                }))
              }
              type="button"
              className="flex h-8 items-center justify-center rounded-lg border p-[10px] font-bold disabled:bg-gray-100 disabled:text-black"
            >
              {"- 10.000"}
            </Button>
            <InputMoney
              id="total_payment"
              type="text"
              placeholder="Masukkan nominal saldo"
              value={topUpWallet.amount}
              onChange={(value) => {
                const numericValue =
                  parseInt(value.toString().replace(/\D/g, ""), 10) || 0; // Remove non-numeric characters
                setInputValue(numericValue);
              }}
            />
            <Button
              onClick={() =>
                setWristbandRent((prevState) => ({
                  ...prevState,
                  amount: topUpWallet.amount + 10000,
                }))
              }
              type="button"
              className="flex h-8 items-center justify-center rounded-lg border bg-qubu_blue p-[10px] font-bold text-white"
            >
              {"+ 10.000"}
            </Button>
          </div>
          {state.errors?.amount && (
            <ValidationErrorMessage
              errorMessage={state.errors.amount.toString()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
