"use client";

import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { Role } from "@/types/role";
import { redirect } from "next/navigation";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import storeUser from "../create/_actions/store-user";

export default function FormCreateUser({ roles }: { roles: Role[] }) {
  const [state, formAction] = useActionState(storeUser, initialValue);
  const [roleIds, setRoleIds] = useState<string[]>([]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("role_ids", JSON.stringify(roleIds));
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
        <Label htmlFor="name">Nama Pengguna</Label>
        <Input
          id="name"
          name="name"
          autoComplete="off"
          placeholder="Masukkan nama pengguna"
        />
        {state?.errors?.name && (
          <ValidationErrorMessage errorMessage={state.errors.name.toString()} />
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="off"
          placeholder="Masukkan email pengguna"
        />
        {state?.errors?.email && (
          <ValidationErrorMessage
            errorMessage={state.errors.email.toString()}
          />
        )}
      </div>
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          autoComplete="off"
          placeholder="Masukkan username"
        />
        {state?.errors?.username && (
          <ValidationErrorMessage
            errorMessage={state.errors.username.toString()}
          />
        )}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="off"
          placeholder="Masukkan password"
        />
        {state?.errors?.password && (
          <ValidationErrorMessage
            errorMessage={state.errors.password.toString()}
          />
        )}
      </div>
      <div>
        <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
        <Input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          autoComplete="off"
          placeholder="Masukkan konfirmasi password"
        />
        {state?.errors?.password_confirmation && (
          <ValidationErrorMessage
            errorMessage={state.errors.password_confirmation.toString()}
          />
        )}
      </div>
      <div>
        <Label htmlFor="role_ids">Role</Label>
        <MultiSelectRole roles={roles} setRoleIds={setRoleIds} />
        {state?.errors?.role_ids && (
          <ValidationErrorMessage
            errorMessage={state.errors.role_ids.toString()}
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

function MultiSelectRole({
  roles,
  setRoleIds,
}: {
  roles: Role[];
  setRoleIds: Dispatch<SetStateAction<string[]>>;
}) {
  return (
    <MultiSelect
      options={roles.map((role) => ({
        label: role.description,
        value: role.id.toString(),
      }))}
      onValueChange={(roleIds) => setRoleIds(roleIds)}
    />
  );
}
