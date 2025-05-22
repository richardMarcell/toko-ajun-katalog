"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import register from "../_actions/register";
import { initialValue } from "@/repositories/initial-value-form-state";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";

export function FormRegister() {
  const [state, formAction] = useActionState(register, initialValue);

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
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nama
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Masukkan nama Anda"
            autoComplete="off"
          />
          {state?.errors?.name && (
            <ValidationErrorMessage
              errorMessage={state.errors.name.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </Label>
          <Input
            id="username"
            name="username"
            placeholder="Masukkan username"
            autoComplete="off"
          />
          {state?.errors?.username && (
            <ValidationErrorMessage
              errorMessage={state.errors.name.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </Label>
          <Input
            id="email"
            name="email"
            placeholder="Masukkan email Anda"
            autoComplete="off"
            type="email"
          />
          {state?.errors?.email && (
            <ValidationErrorMessage
              errorMessage={state.errors.email.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </Label>
          <Input
            id="username"
            name="password"
            placeholder="Masukkan password"
            autoComplete="off"
            type="password"
          />
          {state?.errors?.password && (
            <ValidationErrorMessage
              errorMessage={state.errors.password.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="password_confirmation"
            className="block text-sm font-medium text-gray-700"
          >
            Konfirmasi Password
          </Label>
          <Input
            id="password_confirmation"
            name="password_confirmation"
            placeholder="Masukkan konfirmasi password"
            autoComplete="off"
            type="password"
          />
          {state?.errors?.password_confirmation && (
            <ValidationErrorMessage
              errorMessage={state.errors.password_confirmation.toString()}
            />
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full rounded-md border border-transparent bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 disabled:bg-red-300"
      >
        Kirim
      </Button>
    </form>
  );
}
