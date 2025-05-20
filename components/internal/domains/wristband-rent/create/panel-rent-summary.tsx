"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatNumberToCurrency } from "@/lib/utils";
import { WristbandRentTemporaryType } from "@/types/domains/wristband-rent/general";
import Image from "next/image";

export default function PanelWristbandRentSummary({
  wristbandRent,
  handleCancel,
}: {
  wristbandRent: WristbandRentTemporaryType;
  handleCancel: () => void;
}) {
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
              <p>Saldo CashQ</p>
              <p className="text-right">
                {formatNumberToCurrency(wristbandRent.saldo)}
              </p>
            </div>
            <div className="grid grid-cols-2">
              <p>Deposit Gelang</p>
              <p className="text-right">
                {formatNumberToCurrency(wristbandRent.deposit_amount)}
              </p>
            </div>
          </div>

          <div className="max-h-[410px] border-b-2 border-dashed border-b-gray-300 pt-8"></div>

          <div className="mt-4 space-y-4 rounded-lg">
            <div className="flex justify-between font-bold">
              <div className="w-20">Total</div>
              <div className="">
                {formatNumberToCurrency(
                  wristbandRent.saldo + wristbandRent.deposit_amount,
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
