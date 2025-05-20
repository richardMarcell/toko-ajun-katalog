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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SupportTicketIncludeRelationship } from "../_repositories/get-support-tickets";
import { startTransition, useActionState, useEffect, useState } from "react";
import markTicketSupportAsDone from "../_actions/mark-ticket-support-as-done";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { toast } from "sonner";

export default function CheckboxMarkSupportTicketAsDone({
  supportTicket,
}: {
  supportTicket: SupportTicketIncludeRelationship;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [state, formAction] = useActionState(
    markTicketSupportAsDone,
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
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>
        <div className="flex cursor-pointer items-center space-x-2">
          <Label className="cursor-pointer text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Tandai Selesai
          </Label>
          <Checkbox checked={isOpen} />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Penyelesaian Tiket</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menandai tiket pada perangkat dengan lokasi
            IP <strong>{supportTicket.ip_address}</strong> sebagai{" "}
            <strong>selesai</strong>? Tindakan ini menyatakan bahwa masalah pada
            tiket telah ditangani oleh tim IT.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => startTransition(() => formAction(supportTicket.id))}
            className="bg-qubu_blue"
          >
            Tandai Selesai
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
