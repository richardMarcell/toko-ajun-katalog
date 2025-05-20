"use client";

import { storeSwimsuitRentTemporary } from "@/app/(main)/swimsuit-rent/create/_actions/store-swimsuit-rent-temporary";
import { AlertDialogMessage } from "@/components/internal/AlertDialogMessage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSwimsuitRentContext } from "@/contexts/swimsuit-rent-context";
import { formatNumberToCurrency } from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { Wallet } from "@/types/wallet";
import { redirect, useSearchParams } from "next/navigation";
import {
  BaseSyntheticEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { CardProductSummary } from "./card-product-summary";

export function PanelSwimsuitRentSummary({
  wallet,
}: {
  wallet: Wallet | null;
}) {
  const {
    swimsuitRentTemporaryInput,
    setSwimsuitRentTemporaryInput,
    initialSwimsuitRentTemporaryValues,
  } = useSwimsuitRentContext();

  const [state, formAction] = useActionState(
    storeSwimsuitRentTemporary,
    initialValue,
  );
  const searchParams = useSearchParams();
  const wristbandCode =
    swimsuitRentTemporaryInput.wristband_code ??
    searchParams.get("wristbandCode");

  const [isError, setIsError] = useState<boolean>(false);

  const onSubmit = () => {
    startTransition(() => {
      const formData = new FormData();
      if (wristbandCode) formData.set("wristband_code", wristbandCode);
      formData.set("customer_name", swimsuitRentTemporaryInput.customer_name);
      formData.set(
        "customer_phone_number",
        swimsuitRentTemporaryInput.customer_phone_number,
      );
      formData.set(
        "sales_details",
        JSON.stringify(swimsuitRentTemporaryInput.sales_details),
      );

      formAction(formData);
    });
  };

  useEffect(() => {
    // TODO: customer_phone_number set like customer_name
    if (wallet) {
      sessionStorage.setItem(
        "swimsuit-rent-temporary",
        JSON.stringify({
          ...swimsuitRentTemporaryInput,
          customer_name: wallet.customer_name,
          customer_phone_number: wallet.customer_phone_number,
        }),
      );
    }
  }, [wallet, swimsuitRentTemporaryInput]);

  useEffect(() => {
    if (state.status == "success") {
      sessionStorage.setItem(
        "swimsuit-rent-temporary",
        JSON.stringify(state.data),
      );

      toast(state.message, {
        duration: 2000,
      });

      redirect("/swimsuit-rent/sales/create");
    }

    if (state.status == "error") setIsError(true);
  }, [state]);

  return (
    <div className="w-[25%] space-y-3">
      <Button
        onClick={() => {
          if (sessionStorage.getItem("swimsuit-rent-temporary"))
            sessionStorage.removeItem("swimsuit-rent-temporary");

          setSwimsuitRentTemporaryInput(initialSwimsuitRentTemporaryValues);
        }}
        className="w-full p-2"
      >
        {"+ Create New Order"}
      </Button>

      <Card className="border p-4">
        <input
          value={swimsuitRentTemporaryInput.customer_name}
          type="text"
          maxLength={25}
          placeholder="Customer's Name"
          autoComplete="off"
          className="w-full rounded-md text-xl font-medium placeholder:text-xl placeholder:font-medium focus:border-transparent focus:outline-none"
          onChange={(e: BaseSyntheticEvent) =>
            setSwimsuitRentTemporaryInput({
              ...swimsuitRentTemporaryInput,
              customer_name: e.target.value,
            })
          }
        />

        <div className="max-h-[340px] pt-4">
          {swimsuitRentTemporaryInput.sales_details.length === 0 && (
            <div className="p-4 text-center text-gray-300">
              <span className="block w-full border-b-4 border-dashed pb-2">
                No Item Selected
              </span>
            </div>
          )}

          <ScrollArea className="h-[330px]">
            <div className="space-y-4">
              {swimsuitRentTemporaryInput.sales_details.map((detail, index) => {
                return <CardProductSummary saleDetail={detail} key={index} />;
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="mt-4 space-y-4 rounded-lg border bg-gray-100 p-3 text-gray-500">
          <div className="flex justify-between font-bold">
            <div className="w-20">Total</div>
            <div className="">
              {formatNumberToCurrency(swimsuitRentTemporaryInput.total_gross)}
            </div>
          </div>
        </div>

        <Button
          onClick={onSubmit}
          className="mt-4 w-full bg-qubu_blue p-2"
          type="button"
        >
          Buat Pesanan
        </Button>
      </Card>

      <AlertDialogMessage
        message={Object.values(state.errors ?? {})[0]}
        isOpen={isError}
        type={"error"}
        onClose={() => setIsError(false)}
      />
    </div>
  );
}
