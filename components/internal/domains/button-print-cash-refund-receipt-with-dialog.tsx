"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  GazeboTypeEnum,
  getGazeboDisplayType,
} from "@/lib/enums/GazeboTypeEnum";
import {
  getLockerDisplayType,
  LockerTypeEnum,
} from "@/lib/enums/LockerTypeEnum";
import { printCashRefund } from "@/lib/services/print-receipt/print-cash-refund";
import { CashRefundReceipt } from "@/types/cash-refund-receipt";
import { ArrowLeft, Printer } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Fragment, useState } from "react";

export default function ButtonPrintCashRefundReceiptWithDialog({
  cashRefundReceipt,
  gazeboRents,
  lockerRents,
}: {
  cashRefundReceipt: CashRefundReceipt;
  gazeboRents: {
    type: string;
    gazebo: {
      label: string;
    } | null;
  }[];
  lockerRents: {
    type: string;
    locker: {
      label: string;
    } | null;
  }[];
}) {
  const [showModalSuccessReturnWristband, setShowModalSuccessReturnWristband] =
    useState<boolean>(false);

  const isRentGazebo = gazeboRents.length > 0;
  const isRentLocker = lockerRents.length > 0;

  const handleOnClickCetakStruk = async () => {
    const { response } = await printCashRefund({
      cashRefundReceipt: cashRefundReceipt,
    });

    if (response.statusCode === 200) {
      setShowModalSuccessReturnWristband(true);
    }
  };

  const handleBackToDashboard = () => {
    redirect("/cashq-transaction");
  };

  return (
    <Fragment>
      <Button
        className="flex w-full items-center justify-center gap-2"
        onClick={handleOnClickCetakStruk}
      >
        <Printer />
        <span>Cetak Struk</span>
      </Button>

      <Dialog
        open={showModalSuccessReturnWristband}
        onOpenChange={setShowModalSuccessReturnWristband}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle>Berhasil dikembalikan</DialogTitle>
          <div>
            <div className="flex w-full justify-center">
              <Image
                src="/assets/imgs/success-refund-wristband.png"
                alt="header-card"
                width={200}
                height={0}
                className="rounded-lg object-contain"
              />
            </div>
            <div className="space-y-4 text-center">
              <p className="text-xl">
                {/* TODO: simplify this process to return information text */}
                {isRentGazebo &&
                  `Gazebo (${gazeboRents.map((gazeboRent) => `${getGazeboDisplayType(gazeboRent.type as GazeboTypeEnum)}-${gazeboRent.gazebo?.label ?? ""}`).join(", ")}) ${gazeboRents.length}/${gazeboRents.length}`}{" "}
                {isRentGazebo && isRentLocker && "& "}
                {isRentLocker &&
                  `Loker (${lockerRents.map((lockerRent) => `${getLockerDisplayType(lockerRent.type as LockerTypeEnum)}-${lockerRent.locker?.label ?? ""}`).join(", ")}) ${lockerRents.length}/${lockerRents.length}`}
              </p>
              <div>
                <p className="text-2xl">
                  <strong>BERHASIL</strong> dikembalikan,
                </p>
                {(isRentGazebo || isRentLocker) && (
                  <p className="text-sm">
                    * Silahkan hubungi divisi housekeeping untuk melakukan
                    pembersihan
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="py-4">
            <Button
              type="button"
              className="w-full bg-qubu_vivid_blue hover:bg-qubu_vivid_blue/80"
              onClick={handleBackToDashboard}
            >
              <ArrowLeft />
              Back to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
