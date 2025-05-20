"use client";

import { Button } from "@/components/ui/button";
import { printCaptainOrderBill } from "@/lib/services/print-receipt/print-captain-order-bill";
import { CaptainOrderBill } from "@/types/captain-order-bill";
import { Printer } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function ButtonPrintCaptainOrderBill({
  captainOrderBill,
  redirectUrl,
}: {
  captainOrderBill: CaptainOrderBill;
  redirectUrl: string;
}) {
  const handlePrintTableCheck = async () => {
    const { response } = await printCaptainOrderBill({
      captainOrderBill: captainOrderBill,
    });

    if (response.statusCode === 200) {
      toast("Berhasil mencetak Bill Captain Order", {
        duration: 3000,
      });

      redirect(redirectUrl);
    }
  };

  return (
    <Button
      className="flex w-full items-center justify-center gap-2"
      onClick={handlePrintTableCheck}
    >
      <Printer />
      <span>Print Captain Order Bill</span>
    </Button>
  );
}
