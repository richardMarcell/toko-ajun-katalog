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
import { initialValue } from "@/repositories/initial-value-form-state";
import { User } from "@/types/next-auth";
import { redirect } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { storeSales } from "../_actions/store-sales";

export function AlertDialogStoreSales({ user }: { user: User }) {
  const [state, formAction] = useActionState(storeSales, initialValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleButtonContinueOnClick = () => {
    setIsLoading(true);
    startTransition(() => {
      const formData = new FormData();
      formData.set("user_id", user.id);

      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 3000,
      });
      setIsLoading(false);
    }

    if (state.status == "success" && state.url) {
      redirect(state.url);
    }
  }, [state]);

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-blue-600">Proses Pesanan</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Pembelian Produk</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin melanjutkan proses pemesanan, proses ini
            tidak dapat dibatalkan?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <Button
            disabled={isLoading}
            onClick={() => handleButtonContinueOnClick()}
            className="bg-blue-600"
          >
            {isLoading ? "Memproses..." : "Lanjutkan"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
