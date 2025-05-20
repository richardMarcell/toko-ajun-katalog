"use client";
import InputMoney from "@/components/internal/InputMoney";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNumberToCurrency, roundCurrency } from "@/lib/utils";
import { ServerActionResponse } from "@/types/domains/server-action";
import { WristbandRentTemporaryType } from "@/types/domains/wristband-rent/general";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function FormCreateWallet({
  state,
  wristbandRent,
  setWristbandRent,
}: {
  state: ServerActionResponse;
  wristbandRent: WristbandRentTemporaryType;
  setWristbandRent: Dispatch<SetStateAction<WristbandRentTemporaryType>>;
}) {
  const [inputValue, setInputValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const rounded = roundCurrency(Number(inputValue));

      setWristbandRent((prevState) => ({
        ...prevState,
        saldo: rounded,
      }));
    }, 700);

    return () => clearTimeout(timeout);
  }, [inputValue, setWristbandRent]);

  return (
    <div className="pt-8">
      <div className="flex justify-between">
        <div>
          <p>Gelang</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={wristbandRent.quantity === 1}
            onClick={() =>
              setWristbandRent((prevState) => ({
                ...prevState,
                quantity: wristbandRent.quantity - 1,
              }))
            }
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border p-[10px] font-bold disabled:bg-gray-100 disabled:text-black"
          >
            {"-"}
          </Button>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-gray-100 p-[10px] font-bold">
            {wristbandRent.quantity}
          </div>

          <Button
            onClick={() =>
              setWristbandRent((prevState) => ({
                ...prevState,
                quantity: wristbandRent.quantity + 1,
              }))
            }
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border bg-qubu_blue p-[10px] font-bold text-white"
          >
            {"+"}
          </Button>
        </div>
        <Input
          type="text"
          className="w-56 text-right"
          value={formatNumberToCurrency(wristbandRent.deposit_amount)}
          autoComplete="off"
          disabled
        />
      </div>
      <div className="grid gap-4 pt-4">
        <div className="space-y-2">
          <div>
            <Label htmlFor="saldo">Saldo</Label>
          </div>
          <div className="flex items-center gap-2">
            <Button
              disabled={wristbandRent.saldo === 0}
              onClick={() =>
                setWristbandRent((prevState) => ({
                  ...prevState,
                  saldo: wristbandRent.saldo - 10000,
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
              value={wristbandRent.saldo}
              onChange={(value) => {
                const numericValue =
                  parseInt(value.toString().replace(/\D/g, ""), 10) || 0; // Remove non-numeric characters
                setInputValue(numericValue);
              }}
              // onBlur={(event) => {
              //   const value = event.target.value;
              //   const numericValue = parseInt(value.replace(/\D/g, ""), 10); // Remove non-numeric characters
              //   const rounded = roundCurrency(Number(numericValue));

              //   setWristbandRent((prevState) => ({
              //     ...prevState,
              //     saldo: rounded,
              //   }));
              // }}
            />
            <Button
              onClick={() =>
                setWristbandRent((prevState) => ({
                  ...prevState,
                  saldo: wristbandRent.saldo + 10000,
                }))
              }
              type="button"
              className="flex h-8 items-center justify-center rounded-lg border bg-qubu_blue p-[10px] font-bold text-white"
            >
              {"+ 10.000"}
            </Button>
          </div>
          {state.errors?.saldo && (
            <ValidationErrorMessage
              errorMessage={state.errors.saldo.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <div>
            <Label htmlFor="customer_name">Nama</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Input
            placeholder="Masukkan nama pelanggan"
            id="customer_name"
            name="customer_name"
            defaultValue={wristbandRent.customer_name}
            autoComplete="off"
            onChange={(event) => {
              setWristbandRent((prevState) => ({
                ...prevState,
                customer_name: event.target.value,
              }));
            }}
          />
          {state.errors?.customer_name && (
            <ValidationErrorMessage
              errorMessage={state.errors.customer_name.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <div>
            <Label htmlFor="customer_phone_number">No. HP</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Input
            placeholder="Masukkan No. HP pelanggan"
            id="customer_phone_number"
            name="customer_phone_number"
            defaultValue={wristbandRent.customer_phone_number}
            autoComplete="off"
            maxLength={15}
            onChange={(event) => {
              event.target.value = event.target.value.replace(/[^0-9]/g, "");

              setWristbandRent((prevState) => ({
                ...prevState,
                customer_phone_number: event.target.value,
              }));
            }}
          />
          {state.errors?.customer_phone_number && (
            <ValidationErrorMessage
              errorMessage={state.errors.customer_phone_number.toString()}
            />
          )}
        </div>

        {Array.from({ length: wristbandRent.quantity }).map((_, index) => (
          <div className="space-y-2" key={index}>
            <div>
              <Label htmlFor={`wristband_rent_code[${index}]`}>
                #{index + 1} CashQ Code
              </Label>
              <span className="text-qubu_red">*</span>
            </div>
            <Input
              placeholder="Masukkan Kode CashQ"
              id={`wristband_rent_code_${index}`}
              name={`wristband_rent_code[${index}]`}
              defaultValue={wristbandRent.wristband_rent_code[index]}
              autoComplete="off"
              onChange={(event) => {
                const newWristbandRentCode = [
                  ...wristbandRent.wristband_rent_code,
                ];
                newWristbandRentCode[index] = event.target.value;
                setWristbandRent((prevState) => ({
                  ...prevState,
                  wristband_rent_code: newWristbandRentCode,
                }));
              }}
            />
            {state.errors?.wristband_rent_code && (
              <div>
                <ValidationErrorMessage
                  errorMessage={state.errors.wristband_rent_code.toString()}
                />
              </div>
            )}
            {renderDynamicInputValidationError(
              state.errors,
              `wristband_rent_code[${index}]`,
            )}
          </div>
        ))}
      </div>
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
