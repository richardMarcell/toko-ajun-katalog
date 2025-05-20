"use client";

import { Button } from "@/components/ui/button";
import { print } from "@/lib/services/print-receipt/print";
import { SaleReceipt } from "@/types/sale-receipt";
import { Printer } from "lucide-react";
import { redirect } from "next/navigation";
import ButtonReprintReceipt from "./button-reprint-receipt";

export default function ButtonPrintReceipt({
  saleReceipt,
  redirectUrl,
}: {
  saleReceipt: SaleReceipt;
  redirectUrl: string;
}) {
  const handlePrintReceipt = async () => {
    const { response } = await print({ saleReceipt: saleReceipt });

    if (response.statusCode === 200) {
      if (saleReceipt.is_print_as_copy) {
        // redirect("/sales");
        window.close();
      }

      redirect(redirectUrl);
    }
  };

  return (
    <div>
      {saleReceipt.is_print_as_copy ? (
        <ButtonReprintReceipt handlePrintReceipt={handlePrintReceipt} />
      ) : (
        <Button
          className="flex w-full items-center justify-center gap-2"
          onClick={handlePrintReceipt}
        >
          <Printer />
          <span>Cetak Struk</span>
        </Button>
      )}
    </div>
  );
}
