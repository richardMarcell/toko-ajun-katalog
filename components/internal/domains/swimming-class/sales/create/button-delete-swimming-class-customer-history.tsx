"use client";

import { destroySwimmingClassCustomerHistory } from "@/app/(main)/swimming-class/sales/create/_actions/destroy-swimming-class-customer-history";
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
import { SwimmingClassCustomerHistoryIncludeRelations } from "@/types/domains/swimming-class/sales/create";
import { Ban } from "lucide-react";
import { redirect } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

export function ButtonDeletSwimmingClassCustomerHistory({
  swimmingClassCustomerHistory,
}: {
  swimmingClassCustomerHistory: SwimmingClassCustomerHistoryIncludeRelations;
}) {
  const [state, formAction] = useActionState(
    destroySwimmingClassCustomerHistory,
    initialValue,
  );

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 2000,
      });
    }

    if (state.status === "success") {
      redirect("/swimming-class");
    }
  }, [state]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant={"destructive"}
          className="flex items-center justify-center gap-2"
        >
          <Ban />
          <span>Batal & Hapus Transaksi</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Pembatalan Transaksi</AlertDialogTitle>
          <AlertDialogDescription>
            Anda akan membatalkan transaksi atas nama{" "}
            <strong>
              {swimmingClassCustomerHistory.swimmingClassCustomer.name}
            </strong>
            . Tindakan ini akan menghapus seluruh data terkait transaksi ini dan
            tidak dapat dikembalikan. Apakah Anda yakin ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={() =>
              startTransition(() =>
                formAction(BigInt(swimmingClassCustomerHistory.id)),
              )
            }
            type="button"
            variant={"destructive"}
          >
            <span>Batal & Hapus Transaksi</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
