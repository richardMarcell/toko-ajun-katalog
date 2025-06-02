"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getSalesStatusCase,
  SalesStatusEnum,
} from "@/lib/enums/SalesStatusEnum";
import { initialValue } from "@/repositories/initial-value-form-state";
import { redirect } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateSales } from "../[salesId]/edit/_actions/update-sales";
import { SaleIncluRelationship } from "../_repositories/get-sale";
import { Label } from "@/components/ui/label";

export function FormEditSales({ sale }: { sale: SaleIncluRelationship }) {
  const [state, formAction] = useActionState(updateSales, initialValue);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("sales_id", sale.id.toString());

      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 2000,
      });
    }

    if (state.status == "success") redirect(state.url ?? "");
  }, [state]);

  return (
    <form onSubmit={onSubmit} className="">
      <div className="space-y-2">
        <Label>Status Penjualan</Label>
        <div className="flex gap-2">
          <Select
            disabled={sale.status === SalesStatusEnum.CLOSED}
            name="status"
            defaultValue={sale.status}
          >
            <SelectTrigger className="w-[320px] bg-white">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(SalesStatusEnum).map((status) => {
                  return (
                    <SelectItem key={status} value={status}>
                      {getSalesStatusCase(status)}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            disabled={sale.status === SalesStatusEnum.CLOSED}
            type="submit"
          >
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </form>
  );
}
