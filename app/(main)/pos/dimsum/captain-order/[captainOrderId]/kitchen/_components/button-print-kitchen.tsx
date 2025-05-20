"use client";

import { Button } from "@/components/ui/button";
import { printCaptainOrderKitchen } from "@/lib/services/print-receipt/print-captain-order-kitchen";
import { CaptainOrderKitchen } from "@/types/captain-order-kitchen";
import { Printer } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function ButtonPrintKitchen({
  kitchen,
  redirectUrl,
}: {
  kitchen: CaptainOrderKitchen;
  redirectUrl: string;
}) {
  const handlePrintKitchen = async () => {
    const { response } = await printCaptainOrderKitchen({
      kitchen: kitchen,
    });

    if (response.statusCode === 200) {
      toast("Berhasil mencetak list dapur", {
        description: "List pesanan sudah dikirim ke bagian dapur",
        duration: 3000,
      });

      redirect(redirectUrl);
    }
  };

  return (
    <Button
      className="flex w-full items-center justify-center gap-2"
      onClick={handlePrintKitchen}
    >
      <Printer />
      <span>Print Kitchen</span>
    </Button>
  );
}
