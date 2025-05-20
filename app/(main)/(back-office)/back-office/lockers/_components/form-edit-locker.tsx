"use client";

import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getLockerDisplayStatus,
  LockerStatusEnum,
} from "@/lib/enums/LockerStatusEnum";
import {
  getLockerDisplayType,
  LockerTypeEnum,
} from "@/lib/enums/LockerTypeEnum";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { Locker } from "@/types/locker";
import { redirect } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import updateLocker from "../[lockerId]/edit/_actions/update-locker";

export default function FormEditLocker({ locker }: { locker: Locker }) {
  const [state, formAction] = useActionState(updateLocker, initialValue);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("locker_id", locker.id.toString());
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
        <Label htmlFor="label">Nomor</Label>
        <Input
          id="label"
          name="label"
          autoComplete="off"
          placeholder="Masukkan nomor loker"
          disabled
          defaultValue={locker.label}
        />
        {state?.errors?.label && (
          <ValidationErrorMessage
            errorMessage={state.errors.label.toString()}
          />
        )}
      </div>
      <div>
        <Label htmlFor="type">Tipe Loker</Label>
        <Select defaultValue={locker.type} disabled name="type">
          <SelectTrigger>
            <SelectValue placeholder="Pilih tipe loker" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(LockerTypeEnum).map((type) => {
              return (
                <SelectItem key={type} value={type}>
                  {getLockerDisplayType(type)}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {state?.errors?.type && (
          <ValidationErrorMessage errorMessage={state.errors.type.toString()} />
        )}
      </div>
      <div>
        <Label htmlFor="status">Status loker</Label>
        <Select defaultValue={locker.status} name="status">
          <SelectTrigger>
            <SelectValue placeholder="Pilih status loker" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(LockerStatusEnum).map((status) => {
              return (
                <SelectItem key={status} value={status}>
                  {getLockerDisplayStatus(status)}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {state?.errors?.status && (
          <ValidationErrorMessage
            errorMessage={state.errors.status.toString()}
          />
        )}
      </div>
      <div>
        <Label htmlFor="wristband_code">Kode Gelang</Label>
        <Input
          id="wristband_code"
          name="wristband_code"
          autoComplete="off"
          placeholder="Masukkan kode gelang"
          defaultValue={locker.wristband_code}
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
