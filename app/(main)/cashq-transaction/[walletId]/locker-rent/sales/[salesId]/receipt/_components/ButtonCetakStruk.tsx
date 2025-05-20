"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { redirect } from "next/navigation";

export default function ButtonCetakStruk({
  params,
}: {
  params: { walletId: string; lockerWalletId: string };
}) {
  const { walletId, lockerWalletId } = params;

  return (
    <Button
      className="flex w-full items-center justify-center gap-2"
      onClick={() => {
        //TODO: Tambahkan proses cetak struk
        redirect(
          `/cashq-transaction/${walletId}/locker-rent/${lockerWalletId}/edit`,
        );
      }}
    >
      <Printer />
      <span>Cetak Struk</span>
    </Button>
  );
}
