"use client";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import refundWristbandDeposit from "../_actions/refund-wristband-deposit";
import refundWristbandSaldo from "../_actions/refund-wristband-saldo";
import ModalReturnLostWristband from "./modal-return-lost-wristband";

export default function GroupButtonRefundDepositAndSaldo({
  walletId,
  walletWristbandsRentedList,
}: {
  walletId: bigint;
  walletWristbandsRentedList: {
    id: bigint;
    created_at: Date;
    return_status: string;
    wristband_code: string;
  }[];
}) {
  const handleCetakStrukDepositSaja = async () => {
    const response = await refundWristbandDeposit({
      walletId: walletId,
    });

    if (response.status) {
      toast(response.message, {
        duration: 2000,
      });
    }

    if (response.status == "success" && response.url) redirect(response.url);
  };

  const handleCetakStrukRefund = async () => {
    const response = await refundWristbandSaldo({
      walletId: walletId,
    });

    if (response.status) {
      toast(response.message, {
        duration: 2000,
      });
    }

    if (response.status == "success" && response.url) redirect(response.url);
  };

  return (
    <div className="flex gap-2">
      <ModalReturnLostWristband walletId={walletId} walletWristbandsRentedList={walletWristbandsRentedList} />

      <Button className="bg-qubu_green" onClick={handleCetakStrukDepositSaja}>
        <Printer />
        Cetak Struk Deposit Saja
      </Button>

      <Button className="bg-qubu_vivid_blue" onClick={handleCetakStrukRefund}>
        <Printer />
        Cetak Struk Refund
      </Button>
    </div>
  );
}
