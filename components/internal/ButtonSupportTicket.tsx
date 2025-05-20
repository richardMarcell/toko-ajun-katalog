"use client";

import storeSupportTicket from "@/app/_actions/store-support-ticket";
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
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { MessageSquareWarning } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function ButtonSupportTicket() {
  const [state, formAction] = useActionState(storeSupportTicket, initialValue);

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
        <div className="fixed bottom-10 right-4 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-qubu_blue text-white">
          <MessageSquareWarning />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Kirim tiket dukungan ke Tim IT?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan mengirimkan tiket support ke tim IT untuk
            ditindaklanjuti. Pastikan Anda telah memeriksa kembali detail yang
            akan dikirimkan. Apakah Anda yakin ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-qubu_blue"
            onClick={() => startTransition(() => formAction())}
          >
            Kirim
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
