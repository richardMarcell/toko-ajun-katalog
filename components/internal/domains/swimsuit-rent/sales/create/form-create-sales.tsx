"use client";

import { storeSales } from "@/app/(main)/swimsuit-rent/sales/create/_actions/store-sales";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { formatNumberToCurrency } from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { SwimsuitRentTemporary } from "@/types/domains/swimsuit-rent/general";
import { Printer } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { ButtonDeleteSwimsuitRentTemporary } from "./button-delete-swimsuit-rent-temporary";
import { TableListSale } from "./table-list-sale";

export function FormCreateSales() {
  const [state, formAction] = useActionState(storeSales, initialValue);

  const swimsuitRentTemporary: SwimsuitRentTemporary = JSON.parse(
    sessionStorage.getItem("swimsuit-rent-temporary") as string,
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set(
        "sales_details",
        JSON.stringify(swimsuitRentTemporary.sales_details),
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

    if (state.status == "success") {
      if (sessionStorage.getItem("swimsuit-rent-temporary"))
        sessionStorage.removeItem("swimsuit-rent-temporary");

      redirect(state.url ?? "");
    }
  }, [state]);

  if (!swimsuitRentTemporary) return notFound();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid w-1/2 grid-cols-2 gap-4">
        <div className="space-y-2">
          <div>
            <Label htmlFor="customer_name">Nama Penyewa</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Input
            defaultValue={swimsuitRentTemporary.customer_name}
            name="customer_name"
            id="customer_name"
            placeholder="Masukkan nama penyewa"
            autoComplete="off"
          />
          {state.errors?.customer_name && (
            <ValidationErrorMessage
              errorMessage={state.errors.customer_name.toString()}
            />
          )}
        </div>

        <div className="space-y-2">
          <div>
            <Label htmlFor="customer_name">No. Hp</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Input
            defaultValue={swimsuitRentTemporary.customer_phone_number}
            name="customer_phone_number"
            id="customer_phone_number"
            placeholder="Masukkan nama penyewa"
            autoComplete="off"
            onChange={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
            }
          />
          {state.errors?.customer_phone_number && (
            <ValidationErrorMessage
              errorMessage={state.errors.customer_phone_number.toString()}
            />
          )}
        </div>
      </div>

      <TableListSale swimsuitRentTemporary={swimsuitRentTemporary} />

      <div className="spcey-4 border-b-2 border-dashed pb-4">
        <div className="flex justify-between">
          <Label className="font-normal">Subtotal</Label>
          <div>{formatNumberToCurrency(swimsuitRentTemporary.total_gross)}</div>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex justify-between">
          <Label className="text-xl font-bold">Total Pembayaran</Label>
          <div className="text-xl font-bold">
            {formatNumberToCurrency(swimsuitRentTemporary.grand_total)}
          </div>
        </div>

        <div className="space-y-2 pt-8">
          <Label>Metode Pembayaran</Label>
          <Input
            readOnly
            placeholder="Masukkan metode pembayaran"
            value={PaymentMethodEnum.CASH_Q}
            className="w-1/3"
            autoComplete="off"
          />
        </div>

        <div className="space-y-2 pt-4">
          <div>
            <Label htmlFor="wristband_code">CashQ Code</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Input
            name="wristband_code"
            id="wristband_code"
            placeholder="Masukkan kode gelang"
            className="w-1/3"
            defaultValue={swimsuitRentTemporary?.wristband_code}
            autoComplete="off"
          />
          {state.errors?.wristband_code && (
            <ValidationErrorMessage
              errorMessage={state.errors.wristband_code.toString()}
            />
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          className="flex items-center justify-center gap-2"
        >
          <Printer />
          <span>Cetak Struk</span>
        </Button>
        <ButtonDeleteSwimsuitRentTemporary
          swimsuitRentTemporary={swimsuitRentTemporary}
        />
      </div>
    </form>
  );
}
