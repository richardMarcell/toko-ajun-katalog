"use client";

import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { redirect } from "next/navigation";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import { toast } from "sonner";
import updateChangeWristband from "../_actions/update-change-wristband";

export default function FormChangeWristband({
  walletId,
  setIsButtonTukarGelangClicked,
}: {
  walletId: string;
  setIsButtonTukarGelangClicked: Dispatch<SetStateAction<boolean>>;
}) {
  const [state, formAction] = useActionState(
    updateChangeWristband,
    initialValue,
  );

  const onSubmitChangeWristband = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(() => {
      const formData = new FormData(event.currentTarget);
      formData.set("wallet_id", walletId);

      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 2000,
      });
    }

    if (state.status == "success") {
      setIsButtonTukarGelangClicked(false);
    }

    if (state.url) {
      redirect(state.url);
    }
  }, [state, setIsButtonTukarGelangClicked]);

  return (
    <div className="py-6">
      <form onSubmit={onSubmitChangeWristband}>
        <div className="space-y-4">
          <div className="space-y-2">
            <div>
              <Label htmlFor={"wristband_code_1"}>#1 CashQ Code</Label>
              <span className="text-qubu_red">*</span>
            </div>
            <Input
              placeholder="Masukkan Kode CashQ"
              id="wristband_code_1"
              name="wristband_code_1"
              autoComplete="off"
            />
            {state.errors?.wristband_code_1 && (
              <div>
                <ValidationErrorMessage
                  errorMessage={state.errors.wristband_code_1.toString()}
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div>
              <Label htmlFor={"wristband_code_2"}>#2 CashQ Code</Label>
              <span className="text-qubu_red">*</span>
            </div>
            <Input
              placeholder="Masukkan Kode CashQ"
              id="wristband_code_2"
              name="wristband_code_2"
              autoComplete="off"
            />
            {state.errors?.wristband_code_2 && (
              <div>
                <ValidationErrorMessage
                  errorMessage={state.errors.wristband_code_2.toString()}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit">Proceed</Button>
            <Button
              className="bg-qubu_red"
              onClick={() => setIsButtonTukarGelangClicked(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
