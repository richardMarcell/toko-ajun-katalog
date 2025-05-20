"use client";

import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useRef,
} from "react";
import { toast } from "sonner";
import updatePassword from "../[userId]/edit/_actions/update-password";
import { UserIncludeRelationship } from "../_repositories/get-user";

export default function FormEditPassword({
  user,
}: {
  user: UserIncludeRelationship;
}) {
  const [state, formAction] = useActionState(updatePassword, initialValue);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("user_id", user.id.toString());
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 3000,
      });
    }

    if (state.status == "success") {
      formRef.current?.reset();
    }
  }, [state]);
  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="w-full max-w-lg space-y-4"
    >
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

      <div className="flex justify-end">
        <Button className="bg-qubu_green" type="submit">
          Simpan
        </Button>
      </div>
    </form>
  );
}
