"use client";

import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { redirect } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import storeWristband from "../create/_actions/store-wristband";

export default function FormCreateWristband() {
  const [state, formAction] = useActionState(storeWristband, initialValue);

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
        <Label htmlFor="wristband_code">Kode Gelang</Label>
        <Input
          id="wristband_code"
          name="wristband_code"
          autoComplete="off"
          placeholder="Masukkan kode gelang"
        />
        {state?.errors?.wristband_code && (
          <ValidationErrorMessage
            errorMessage={state.errors.wristband_code.toString()}
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
