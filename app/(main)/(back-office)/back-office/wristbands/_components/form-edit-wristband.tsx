"use client";

import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { Wristband } from "@/types/wristband";
import { redirect } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import updateWristband from "../[wristbandCode]/edit/_actions/update-wristband";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getWristbandStatusCase,
  WristbandStatusEnum,
} from "@/lib/enums/WristbandStatusEnum";

export default function FormEditWristband({
  wristband,
}: {
  wristband: Wristband;
}) {
  const [state, formAction] = useActionState(updateWristband, initialValue);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("wristband_code", wristband.code);
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
          value={wristband.code}
          id="wristband_code"
          autoComplete="off"
          placeholder="Masukkan kode gelang"
          disabled
        />
        {state?.errors?.wristband_code && (
          <ValidationErrorMessage
            errorMessage={state.errors.wristband_code.toString()}
          />
        )}
      </div>
      <div>
        <Label htmlFor="status">Status Gelang</Label>
        <Select name="status" defaultValue={wristband.status}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih status gelang" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(WristbandStatusEnum).map((status) => {
              return (
                <SelectItem key={status} value={status}>
                  {getWristbandStatusCase(status)}
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

      <div className="flex justify-end">
        <Button className="bg-qubu_green" type="submit">
          Simpan
        </Button>
      </div>
    </form>
  );
}
