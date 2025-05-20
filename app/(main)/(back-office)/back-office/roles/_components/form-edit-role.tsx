"use client";

import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { redirect } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import updateRole from "../[roleId]/edit/_actions/update-role";
import { roleIncludeRelationship } from "../_repositories/get-role";

export default function FormEditRole({
  role,
}: {
  role: roleIncludeRelationship;
}) {
  const [state, formAction] = useActionState(updateRole, initialValue);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("role_id", role.id.toString());
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
          defaultValue={role.name}
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
          defaultValue={role.description}
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
