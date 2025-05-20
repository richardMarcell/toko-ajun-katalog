"use client";

import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { redirect } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import storeTenant from "../create/_actions/store-tenant";

export default function FormCreateTenant() {
  const [state, formAction] = useActionState(storeTenant, initialValue);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 3000,
      });
    }

    if (state.status === "success" && state.url) {
      redirect(state.url);
    }
  }, [state]);
  return (
    <form onSubmit={onSubmit} className="w-full max-w-lg space-y-4">
      <div>
        <Label htmlFor="name">Nama</Label>
        <Input
          id="name"
          name="name"
          autoComplete="off"
          placeholder="Masukkan nama"
        />
        {state?.errors?.name && (
          <ValidationErrorMessage errorMessage={state.errors.name.toString()} />
        )}
      </div>
      {/* TODO: read the file and store to local storage */}
      <div>
        <Label htmlFor="image">Gambar</Label>
        <Input
          id="image"
          name="image"
          autoComplete="off"
          placeholder="Masukkan gambar"
          type="file"
        />
        {state?.errors?.image && (
          <ValidationErrorMessage
            errorMessage={state.errors.image.toString()}
          />
        )}
      </div>
      <div>
        <Label htmlFor="ip_address">IP Address</Label>
        <Input
          id="ip_address"
          name="ip_address"
          autoComplete="off"
          placeholder="Ex: 192.xxx.xxx.xxx"
        />
        {state?.errors?.ip_address && (
          <ValidationErrorMessage
            errorMessage={state.errors.ip_address.toString()}
          />
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="is_required_tax" name="is_required_tax" />
        <Label
          htmlFor="is_required_tax"
          className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Dikenai pajak?
        </Label>
        {state?.errors?.is_required_tax && (
          <ValidationErrorMessage
            errorMessage={state.errors.is_required_tax.toString()}
          />
        )}
      </div>

      <div className="flex justify-end">
        <Button className="bg-qubu_green" type="submit">
          Simpan
        </Button>
      </div>
    </form>
  );
}
