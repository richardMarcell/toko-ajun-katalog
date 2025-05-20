"use client";

import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { redirect } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import storeRole from "../create/_actions/store-role";

export default function FormCreateRole() {
  const [state, formAction] = useActionState(storeRole, initialValue);

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
        <Label htmlFor="name">Nama Role</Label>
        <Input
          id="name"
          name="name"
          autoComplete="off"
          placeholder="Masukkan nama role"
        />
        {state?.errors?.name && (
          <ValidationErrorMessage errorMessage={state.errors.name.toString()} />
        )}
      </div>
      <div>
        <Label htmlFor="description">Deskripsi Role</Label>
        <Input
          id="description"
          name="description"
          autoComplete="off"
          placeholder="Masukkan nama role"
        />
        {state?.errors?.description && (
          <ValidationErrorMessage
            errorMessage={state.errors.description.toString()}
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
