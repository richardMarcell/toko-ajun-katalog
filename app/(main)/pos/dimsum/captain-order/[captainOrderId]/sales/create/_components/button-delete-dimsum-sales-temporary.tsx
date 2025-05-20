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
import { Ban } from "lucide-react";
import { CaptainOrderIncludeRelationship } from "../../../edit/_types/edit";
import { redirect } from "next/navigation";

export function ButtonDeleteDimsumSalesTemporary({
  captainOrder,
}: {
  captainOrder: CaptainOrderIncludeRelationship;
}) {
  const handleDeleteButtonOnClick = () => {
    if (sessionStorage.getItem(`dimsum-sales-temporary-${captainOrder.id}`)) {
      sessionStorage.removeItem(`dimsum-sales-temporary-${captainOrder.id}`);
    }

    redirect(`/pos/dimsum/captain-order/${captainOrder.id}/edit`);
  };
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
            <strong>{captainOrder.customer_name}</strong>. Tindakan ini akan
            menghapus data terkait transaksi ini dan tidak dapat dikembalikan.
            Apakah Anda yakin ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handleDeleteButtonOnClick}
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
