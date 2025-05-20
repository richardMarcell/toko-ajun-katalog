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
import updateUser from "../[userId]/edit/_actions/update-user";
import { UserIncludeRelationship } from "../_repositories/get-user";

export default function FormEditUser({
  roles,
  user,
}: {
  roles: Role[];
  user: UserIncludeRelationship;
}) {
  const [state, formAction] = useActionState(updateUser, initialValue);
  const [roleIds, setRoleIds] = useState<string[]>(
    user.userHasRoles.map((userHasRole) => userHasRole.role_id.toString()),
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("user_id", user.id.toString());
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
          defaultValue={user.name}
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
          defaultValue={user.email}
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
          defaultValue={user.username}
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
        <Label htmlFor="role_ids">Role</Label>
        <MultiSelectRole
          roles={roles}
          setRoleIds={setRoleIds}
          defaultValues={roleIds}
        />
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
  defaultValues,
}: {
  roles: Role[];
  setRoleIds: Dispatch<SetStateAction<string[]>>;
  defaultValues: string[];
}) {
  return (
    <MultiSelect
      options={roles.map((role) => ({
        label: role.description,
        value: role.id.toString(),
      }))}
      defaultValue={defaultValues}
      onValueChange={(roleIds) => setRoleIds(roleIds)}
      placeholder="Pilih role pengguna"
      variant="inverted"
    />
  );
}
