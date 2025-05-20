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
  GazeboStatusEnum,
  getGazeboStatusCase,
} from "@/lib/enums/GazeboStatusEnum";
import {
  GazeboTypeEnum,
  getGazeboDisplayType,
} from "@/lib/enums/GazeboTypeEnum";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { Gazebo } from "@/types/gazebo";
import { redirect } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import updateGazebo from "../[gazeboId]/edit/_actions/update-gazebo";

export default function FormEditGazebo({ gazebo }: { gazebo: Gazebo }) {
  const [state, formAction] = useActionState(updateGazebo, initialValue);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("gazebo_id", gazebo.id.toString());
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
          placeholder="Masukkan nomor gazebo"
          disabled
          defaultValue={gazebo.label}
        />
        {state?.errors?.label && (
          <ValidationErrorMessage
            errorMessage={state.errors.label.toString()}
          />
        )}
      </div>
      <div>
        <Label htmlFor="type">Tipe Gazebo</Label>
        <Select defaultValue={gazebo.type} disabled name="type">
          <SelectTrigger>
            <SelectValue placeholder="Pilih tipe gazebo" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(GazeboTypeEnum).map((type) => {
              return (
                <SelectItem key={type} value={type}>
                  {getGazeboDisplayType(type)}
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
        <Label htmlFor="status">Status Gazebo</Label>
        <Select defaultValue={gazebo.status} name="status">
          <SelectTrigger>
            <SelectValue placeholder="Pilih status gazebo" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(GazeboStatusEnum).map((status) => {
              return (
                <SelectItem key={status} value={status}>
                  {getGazeboStatusCase(status)}
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
