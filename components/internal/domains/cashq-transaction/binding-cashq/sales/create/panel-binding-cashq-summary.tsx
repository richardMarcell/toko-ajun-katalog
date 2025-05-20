"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatNumberToCurrency } from "@/lib/utils";
import { PaymentMultiple } from "@/types/payment-multiple";
import Image from "next/image";
import { BindingCashQ } from "./panel-binding-cashq";
import { Label } from "@/components/ui/label";

export default function PanelBindingCashQSummary({
  bindingCashQ,
  handleCancel,
  payments,
}: {
  bindingCashQ: BindingCashQ;
  handleCancel: () => void;
  payments: PaymentMultiple[];
}) {
  const totalPaid = payments.reduce(
    (sum, payment) => sum + (payment.total_payment ?? 0),
    0,
  );

  const remainingBalance = totalPaid - bindingCashQ.deposit_amount;
  return (
    <div className="w-[40%]">
      <Image
        src="/assets/imgs/header-card.png"
        alt="header-card"
        width={600}
        height={0}
        className="w-full rounded-lg object-contain p-1"
      />
      <Card className="rounded-tl-none rounded-tr-none border">
        <CardContent className="pt-4">
          <div>
            <div className="grid grid-cols-2">
              <p>Deposit Gelang</p>
              <p className="text-right">
                {formatNumberToCurrency(bindingCashQ.deposit_amount)}
              </p>
            </div>
          </div>

          <div className="max-h-[410px] border-b-2 border-dashed border-b-gray-300 pt-8"></div>

          <div className="mt-4 space-y-4 rounded-lg">
            <div className="flex justify-between text-2xl font-bold">
              <div className="w-20">Total</div>
              <div className="">
                {formatNumberToCurrency(bindingCashQ.deposit_amount)}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between">
              <Label className="text-xl font-bold">Sisa Tagihan</Label>
              <div className="text-xl font-bold">
                {formatNumberToCurrency(
                  remainingBalance < 0 ? remainingBalance : 0,
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <Label className="text-xl font-bold">Kembalian</Label>
              <div className="text-xl font-bold">
                {formatNumberToCurrency(
                  remainingBalance >= 0 ? remainingBalance : 0,
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button className="mt-4 w-full bg-black p-2" type="submit">
            Proceed
          </Button>
          <Button
            onClick={handleCancel}
            className="mt-4 w-full bg-black/50 p-2"
            type="button"
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
