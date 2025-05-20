"use client";

import { Button } from "@/components/ui/button";
import { printCaptainOrderTableCheck } from "@/lib/services/print-receipt/print-captain-order-table-check";
import { CaptainOrderTableCheck } from "@/types/captain-order-table-check";
import { Printer } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function ButtonPrintTableCheck({
  tableCheck,
  redirectUrl,
}: {
  tableCheck: CaptainOrderTableCheck;
  redirectUrl: string;
}) {
  const handlePrintTableCheck = async () => {
    const { response } = await printCaptainOrderTableCheck({
      tableCheck: tableCheck,
    });

    if (response.statusCode === 200) {
      toast("Berhasil mencetak Table Check", {
        description: "Silahkan distribusikan ke meja terkait",
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
      <span>Print Table Check</span>
    </Button>
  );
}
