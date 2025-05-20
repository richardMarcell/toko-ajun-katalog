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
import { Button } from "@/components/ui/button";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { FileWarning } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { IpLocationIncludeRelationship } from "../_repositories/get-ip-location";
import deleteUserSession from "../_actions/delete-user-session";

export default function ButtonResetOp({
  ipLocation,
}: {
  ipLocation: IpLocationIncludeRelationship;
}) {
  const [state, formAction] = useActionState(deleteUserSession, initialValue);

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
        <Button variant={"destructive"} className="flex gap-2">
          <FileWarning />
          <span>Reset OP</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah Anda yakin ingin mengeluarkan pengguna ini dari aplikasi?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Mengeluarkan pengguna ini akan menghentikan akses mereka dan mereka
            harus login kembali untuk menggunakan aplikasi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-qubu_blue"
            onClick={() => startTransition(() => formAction(ipLocation.id))}
          >
            Simpan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
