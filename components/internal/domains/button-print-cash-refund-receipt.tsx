"use client";

import { Button } from "@/components/ui/button";
import { printCashRefund } from "@/lib/services/print-receipt/print-cash-refund";
import { CashRefundReceipt } from "@/types/cash-refund-receipt";
import { Printer } from "lucide-react";
import { redirect } from "next/navigation";

export default function ButtonPrintCashRefundReceipt({
  cashRefundReceipt,
  redirectUrl,
}: {
  cashRefundReceipt: CashRefundReceipt;
  redirectUrl: string;
}) {
  const handlePrintReceipt = async () => {
    const { response } = await printCashRefund({
      cashRefundReceipt: cashRefundReceipt,
    });

    if (response.statusCode === 200) {
      redirect(redirectUrl);
    }
  };

  return (
    <Button
      className="flex w-full items-center justify-center gap-2"
      onClick={handlePrintReceipt}
    >
      <Printer />
      <span>Cetak Struk</span>
    </Button>
  );
}
