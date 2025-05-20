"use client";

import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNumberToCurrency } from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { Product } from "@/types/product";
import { Label } from "@radix-ui/react-label";
import { redirect } from "next/navigation";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import updateAddWristband from "../_actions/update-add-wristband";

type WristbandRentTemporaryType = {
  quantity: number;
  deposit_amount: number;
  wristband_rent_code: string[];
};

const initialWristbandRentValue: WristbandRentTemporaryType = {
  quantity: 1,
  deposit_amount: 0,
  wristband_rent_code: [],
};

export default function FormAddWristband({
  walletId,
  lockerWalletId,
  setIsButtonTambahGelangClicked,
  wristbandProduct,
}: {
  walletId: string;
  lockerWalletId: string;
  setIsButtonTambahGelangClicked: Dispatch<SetStateAction<boolean>>;
  wristbandProduct: Product;
}) {
  const wristbandRentTemporary: WristbandRentTemporaryType = JSON.parse(
    sessionStorage.getItem(
      `{cashq-transaction-add-wristband-wallet-id-${walletId}}`,
    ) as string,
  );
  const [wristbandRent, setWristbandRent] =
    useState<WristbandRentTemporaryType>(
      wristbandRentTemporary ?? initialWristbandRentValue,
    );
  const [state, formAction] = useActionState(updateAddWristband, initialValue);

  useEffect(() => {
    setWristbandRent((prevState) => ({
      ...prevState,
      deposit_amount: wristbandRent.quantity * Number(wristbandProduct.price),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wristbandRent.quantity]);

  const onSubmitAddWristband = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(() => {
      const formData = new FormData(event.currentTarget);
      formData.set("wallet_id", walletId);
      formData.set("locker_wallet_id", lockerWalletId);
      formData.set("quantity", wristbandRent.quantity.toString());
      formData.set(
        "wristband_rent_code",
        JSON.stringify(wristbandRent.wristband_rent_code),
      );

      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 2000,
      });
    }
  }, [state]);

  useEffect(() => {
    if (state.status == "success") {
      sessionStorage.setItem(
        `{cashq-transaction-add-wristband-wallet-id-${walletId}}`,
        JSON.stringify(wristbandRent),
      );
    }

    if (state.url) {
      redirect(state.url);
    }
  }, [state, wristbandRent, walletId]);

  return (
    <div className="py-6">
      <form onSubmit={onSubmitAddWristband}>
        <div className="space-y-4">
          <div className="space-y-2">
            <div>
              <Label htmlFor={"deposit"}>Deposit</Label>
            </div>
            <Input
              placeholder="Nominal deposit"
              id="deposit"
              name="deposit"
              value={formatNumberToCurrency(wristbandRent.deposit_amount)}
              autoComplete="off"
              disabled
            />
          </div>
          {Array.from({ length: wristbandRent.quantity }).map((_, index) => (
            <div className="space-y-2" key={index}>
              <div>
                <Label htmlFor={`wristband_rent_code[${index}]`}>
                  #{index + 1} CashQ Code
                </Label>
                <span className="text-qubu_red">*</span>
              </div>
              <div className="flex gap-2">
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

                {index === wristbandRent.quantity - 1 ? (
                  <button
                    onClick={() =>
                      setWristbandRent((prevState) => ({
                        ...prevState,
                        quantity: wristbandRent.quantity + 1,
                      }))
                    }
                    type="button"
                    className="flex w-10 items-center justify-center rounded-lg bg-qubu_blue font-bold text-white"
                  >
                    {"+"}
                  </button>
                ) : (
                  <button
                    disabled={wristbandRent.quantity == 0}
                    onClick={() =>
                      setWristbandRent((prevState) => ({
                        ...prevState,
                        quantity: wristbandRent.quantity - 1,
                      }))
                    }
                    type="button"
                    className="flex w-10 items-center justify-center rounded-lg border font-bold disabled:bg-gray-100"
                  >
                    {"-"}
                  </button>
                )}
              </div>
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
          <div className="flex justify-end gap-2">
            <Button type="submit">Proceed</Button>
            <Button
              className="bg-qubu_red"
              onClick={() => {
                if (
                  sessionStorage.getItem(
                    `{cashq-transaction-add-wristband-wallet-id-${walletId}}`,
                  )
                )
                  sessionStorage.removeItem(
                    `{cashq-transaction-add-wristband-wallet-id-${walletId}}`,
                  );

                setWristbandRent(initialWristbandRentValue);
                setIsButtonTambahGelangClicked(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
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
