"use client";

import {
  AlertDialog,
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
import { Ban } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { closeCaptainOrder } from "../_actions/close-captain-order";
import { CaptainOrderIncludeRelationship } from "../_types/edit";

export function AlertDialogCloseCaptainOrder({
  captainOrder,
}: {
  captainOrder: CaptainOrderIncludeRelationship;
}) {
  const [state, formAction] = useActionState(closeCaptainOrder, initialValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleButtonContinueOnClick = (captainOrderId: bigint) => {
    startTransition(() => formAction(captainOrderId));
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 3000,
      });
    }

    if (state.status == "success") {
      setIsOpen(false);
    }
  }, [state]);

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button
          disabled={
            captainOrder.captainOrderDetails.length === 0 ||
            captainOrder.is_closed
          }
          variant={"destructive"}
        >
          <Ban />
          <span>Close Captain Order</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Konfirmasi Penutupan Captain Order
          </AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menutup Captain Order atas nama pelanggan{" "}
            <strong>{captainOrder.customer_name}</strong>? Tindakan ini tidak
            dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={() => handleButtonContinueOnClick(captainOrder.id)}
            variant={"destructive"}
          >
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
