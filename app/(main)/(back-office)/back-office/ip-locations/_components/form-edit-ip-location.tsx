"use client";

import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { redirect } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import updateIpLocation from "../[ipLocationId]/edit/_actions/update-ip-location";
import { IpLocationIncludeRelationship } from "../_repositories/get-ip-location";

export default function FormEditIpLocation({
  ipLocation,
}: {
  ipLocation: IpLocationIncludeRelationship;
}) {
  const [state, formAction] = useActionState(updateIpLocation, initialValue);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("ip_location_id", ipLocation.id.toString());
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
        <Label
          htmlFor="ip_address"
          className="text-lg font-semibold text-gray-600"
        >
          Data
        </Label>
      </div>
      <div>
        <Label htmlFor="ip_address">Alamat IP</Label>
        <Input
          id="ip_address"
          name="ip_address"
          autoComplete="off"
          placeholder="Ex: 192.xxx.xxx.xxx"
          defaultValue={ipLocation.ip_address}
        />
        {state?.errors?.ip_address && (
          <ValidationErrorMessage
            errorMessage={state.errors.ip_address.toString()}
          />
        )}
      </div>
      <div>
        <Label htmlFor="location_desc">Deskripsi Lokasi</Label>
        <Input
          id="location_desc"
          name="location_desc"
          autoComplete="off"
          placeholder="Masukkan deskripsi lokasi"
          defaultValue={ipLocation.location_desc}
        />
        {state?.errors?.location_desc && (
          <ValidationErrorMessage
            errorMessage={state.errors.location_desc.toString()}
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
