"use client";
import storeWalletTemporary from "@/app/(main)/wristband-rent/create/_actions/store-wallet-temporary";
import { Card, CardContent } from "@/components/ui/card";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { WristbandRentTemporaryType } from "@/types/domains/wristband-rent/general";
import { Product } from "@/types/product";
import { redirect } from "next/navigation";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import FormCreateWallet from "./form-create-wallet";
import PanelWristbandRentSummary from "./panel-rent-summary";

const initialWristbandRentValue: WristbandRentTemporaryType = {
  quantity: 1,
  deposit_amount: 0,
  saldo: 0,
  customer_name: "",
  customer_phone_number: "",
  wristband_rent_code: [],
};

export default function PanelWristbandRent({
  wristbandProduct,
}: {
  wristbandProduct: Product;
}) {
  const [wristbandRent, setWristbandRent] =
    useState<WristbandRentTemporaryType>(initialWristbandRentValue);
  const [state, formAction] = useActionState(
    storeWalletTemporary,
    initialValue,
  );

  useEffect(() => {
    const wristbandRentTemporary = sessionStorage.getItem("wristband-rent");
    if (wristbandRentTemporary) {
      setWristbandRent(JSON.parse(wristbandRentTemporary));
    }
  }, []);

  useEffect(() => {
    setWristbandRent((prevState) => ({
      ...prevState,
      deposit_amount: wristbandRent.quantity * Number(wristbandProduct.price),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wristbandRent.quantity]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("quantity", wristbandRent.quantity.toString());
      formData.set("saldo", wristbandRent.saldo.toString());
      formData.set(
        "wristband_rent_code",
        JSON.stringify(wristbandRent.wristband_rent_code),
      );

      formAction(formData);
    });
  };

  const handleCancel = () => {
    if (sessionStorage.getItem("wristband-rent"))
      sessionStorage.removeItem("wristband-rent");

    setWristbandRent(initialWristbandRentValue);
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 2000,
      });
    }

    if (state.status == "success") {
      sessionStorage.setItem("wristband-rent", JSON.stringify(wristbandRent));
      redirect("/wristband-rent/sales/create");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form onSubmit={onSubmit}>
      <Card className="w-full px-4 py-5">
        <CardContent className="flex gap-4 p-2">
          <div className="w-[60%]">
            <div className="flex items-center justify-between border-b border-b-gray-200 pb-4">
              <h1 className="text-2xl font-semibold">Sewa Gelang</h1>
            </div>
            <FormCreateWallet
              state={state}
              wristbandRent={wristbandRent}
              setWristbandRent={setWristbandRent}
            />
          </div>
          <PanelWristbandRentSummary
            wristbandRent={wristbandRent}
            handleCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </form>
  );
}
