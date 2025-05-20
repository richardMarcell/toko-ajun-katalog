"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { Promo } from "@/types/promo";
import { startTransition, useActionState, useEffect } from "react";
import updatePromoActiveStatus from "../_actions/update-promo-active-status";
import { toast } from "sonner";

export default function SwitchPromoActiveStatus({ promo }: { promo: Promo }) {
  const [state, formAction] = useActionState(
    updatePromoActiveStatus,
    initialValue,
  );

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 3000,
      });
    }
  }, [state]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div>
          <Switch checked={promo.is_active} className="bg-qubu_blue" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah anda yakin ingin mengubah status aktif promo {promo.name} ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Jika status promo diubah ada kemungkinan promo tidak dapat
            digunakan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-qubu_blue"
            onClick={() => startTransition(() => formAction(promo.id))}
          >
            Simpan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
