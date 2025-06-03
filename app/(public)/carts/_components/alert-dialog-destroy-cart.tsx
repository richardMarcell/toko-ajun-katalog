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
import { Trash } from "lucide-react";
import { redirect } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { destroyCart } from "../_actions/destroy-cart";
import { CartIncludeRelationship } from "../_repositories/get-carts";
import { initialValue } from "@/repositories/initial-value-form-state";

export function AlertDialogDestroyCart({
  cart,
}: {
  cart: CartIncludeRelationship;
}) {
  const [state, formAction] = useActionState(destroyCart, initialValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleButtonContinueOnClick = () => {
    setIsLoading(true);
    startTransition(() => {
      const formData = new FormData();
      formData.set("cart_id", cart.id.toString());

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
        <Button variant={"destructive"}>
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Konfirmasi Pembatalan Item Keranjang Belanja
          </AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus item ini dari keranjang belanja?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <Button
            disabled={isLoading}
            onClick={() => handleButtonContinueOnClick()}
            variant={"destructive"}
          >
            {isLoading ? "Memproses..." : "Lanjutkan"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
