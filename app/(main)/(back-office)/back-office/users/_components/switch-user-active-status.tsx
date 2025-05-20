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
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import updateUserActiveStatus from "../_actions/update-user-active-status";
import { UserIncludeRelationship } from "../_repositories/get-user";

export default function SwitchUserActiveStatus({
  user,
}: {
  user: UserIncludeRelationship;
}) {
  const [state, formAction] = useActionState(
    updateUserActiveStatus,
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
          <Switch checked={user.is_active} className="bg-qubu_blue" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah anda yakin ingin mengubah status aktif pengguna atas nama{" "}
            {user.name} ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Jika status pengguna diubah ada kemungkinan pengguna tidak dapat
            mengakses fitur dalam aplikasi Satelite.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-qubu_blue"
            onClick={() => startTransition(() => formAction(user.id))}
          >
            Simpan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
