"use client";

import { updateEntryPassGeneralData } from "@/app/(main)/entry-pass/[entryPassCustomerId]/edit/_actions/update-entry-pass-general-data";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { EntryPassCustomerWithHistories } from "@/types/domains/entry-pass/edit";
import { redirect } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

export function FormEditGeneralData({
  entryPassCustomer,
  isUserCanEditGeneralData,
}: {
  entryPassCustomer: EntryPassCustomerWithHistories;
  isUserCanEditGeneralData: boolean;
}) {
  const [state, formAction] = useActionState(
    updateEntryPassGeneralData,
    initialValue,
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    startTransition(() => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      formData.append(
        "entry_pass_customer_id",
        entryPassCustomer.id.toString(),
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

    if (state.status == "success") redirect("/entry-pass");
  }, [state]);

  return (
    <form onSubmit={handleSubmit} className="">
      <h2 className="font-bold">Informasi Pelanggan</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <div>
            <Label htmlFor="name">Nama</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Input
            defaultValue={entryPassCustomer.name}
            placeholder="Masukkan nama pelanggan"
            id="name"
            name="name"
            autoComplete="off"
            disabled={!isUserCanEditGeneralData}
          />
          {state.errors?.name && (
            <ValidationErrorMessage
              errorMessage={state.errors.name.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="national_id_number">NIK</Label>
          <Input
            defaultValue={entryPassCustomer.national_id_number?.toString()}
            placeholder="61xxxxxxxxxxxxx"
            name="national_id_number"
            autoComplete="off"
            onChange={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
            }
            minLength={16}
            maxLength={16}
            min={16}
            max={16}
            disabled={!isUserCanEditGeneralData}
          />
          {state.errors?.national_id_number && (
            <ValidationErrorMessage
              errorMessage={state.errors.national_id_number.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <div>
            <Label htmlFor="phone_number">No Hp</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Input
            defaultValue={entryPassCustomer.phone_number}
            placeholder="08xx-xxx-xxx"
            id="phone_number"
            name="phone_number"
            autoComplete="off"
            onChange={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
            }
            disabled={!isUserCanEditGeneralData}
          />
          {state.errors?.phone_number && (
            <ValidationErrorMessage
              errorMessage={state.errors.phone_number.toString()}
            />
          )}
        </div>
      </div>

      {isUserCanEditGeneralData && (
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" className="bg-qubu_blue">
            Simpan Perubahan
          </Button>
        </div>
      )}
    </form>
  );
}
