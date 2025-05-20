"use client";

import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { Tenant } from "@/types/tenant";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import updateTenant from "../[tenantId]/edit/_actions/update-tenant";

export default function FormEditTenant({ tenant }: { tenant: Tenant }) {
  const [state, formAction] = useActionState(updateTenant, initialValue);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("tenant_id", tenant.id.toString());

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
          defaultValue={tenant.name}
        />
        {state?.errors?.name && (
          <ValidationErrorMessage errorMessage={state.errors.name.toString()} />
        )}
      </div>
      {/* TODO: read the file and store to local storage */}
      <div className="space-y-2">
        <Label htmlFor="image">Gambar</Label>
        {tenant.image && (
          <Image
            src={tenant.image}
            alt={tenant.name}
            width={100}
            height={100}
            className="rounded-lg"
          />
        )}
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
          defaultValue={tenant.ip_address}
        />
        {state?.errors?.ip_address && (
          <ValidationErrorMessage
            errorMessage={state.errors.ip_address.toString()}
          />
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_required_tax"
          name="is_required_tax"
          defaultChecked={tenant.is_required_tax}
        />
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
