"use client";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { ServerActionResponse } from "@/types/domains/server-action";
import { CirclePlus, Printer } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import refundWristbandDeposit from "../_actions/refund-wristband-deposit";
import refundWristbandDepositLostOrDamaged from "../_actions/refund-wristband-deposit-lost-or-damaged";
import refundWristbandForfeitDepositSaldoForLostOrDamaged from "../_actions/refund-wristband-forfeit-deposit-saldo-lost-or-damaged";
import refundWristbandSaldo from "../_actions/refund-wristband-saldo";

export default function GroupButtonRefundDepositAndSaldo({
  walletId,
  wristbandCodes,
  isHaveWristbandNotReturnedOpen,
  isHaveWristbandNotReturnedClose,
  isHaveWristbandDepositNotReturned,
  isWalletSaldoReturned,
}: {
  walletId: bigint;
  wristbandCodes: string[];
  isHaveWristbandNotReturnedOpen: boolean;
  isHaveWristbandNotReturnedClose: boolean;
  isHaveWristbandDepositNotReturned: boolean;
  isWalletSaldoReturned: boolean;
}) {
  const [state, setState] = useState<ServerActionResponse>(initialValue);
  const [userAccessCode, setUserAccessCode] = useState<string>("");

  const handleReturnManualGelangRusak = async () => {
    const isUserCodeHaveAccess = true;
    if (isUserCodeHaveAccess) {
      const response = await refundWristbandDepositLostOrDamaged({
        walletId: walletId,
        userAccessCode: userAccessCode,
      });

      setState(response);
    }
  };

  const handleCetakStrukRefundGelangRusak = async () => {
    const response = await refundWristbandForfeitDepositSaldoForLostOrDamaged({
      walletId: walletId,
    });

    setState(response);
  };

  const handleCetakStrukDepositSaja = async () => {
    const response = await refundWristbandDeposit({
      walletId: walletId,
      wristbandCodes: wristbandCodes,
    });

    setState(response);
  };

  const handleCetakStrukRefund = async () => {
    const response = await refundWristbandSaldo({
      walletId: walletId,
    });

    setState(response);
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 2000,
      });
    }

    if (state.status == "success" && state.url) redirect(state.url);
  }, [state]);

  // TODO: if a button already executed, disable to prevent user to click again
  return (
    <div className="flex gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button disabled={!isHaveWristbandNotReturnedOpen}>
            <CirclePlus /> Retur Manual Gelang Rusak
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Konfirmasi Retur Manual Gelang Rusak
            </AlertDialogTitle>
            <AlertDialogDescription>
              Pengembalian manual gelang rusak ini akan mengembalikan deposit
              gelang yang rusak. Apakah Anda yakin ingin melanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="pb-6">
            <div className="space-y-2">
              <div>
                <Label htmlFor="access_code">Kode Akses User</Label>
                <span className="text-qubu_red">*</span>
              </div>
              <Input
                placeholder="Masukkan kode akses user"
                id="access_code"
                name="access_code"
                value={userAccessCode}
                autoComplete="off"
                onChange={(event) => setUserAccessCode(event.target.value)}
              />
              {state.errors?.access_code && (
                <ValidationErrorMessage
                  errorMessage={state.errors.access_code.toString()}
                />
              )}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserAccessCode("")}>
              Cancel
            </AlertDialogCancel>
            <Button type="submit" onClick={handleReturnManualGelangRusak}>
              <span>Retur</span>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        className="bg-qubu_orange"
        disabled={!isHaveWristbandNotReturnedClose}
        onClick={handleCetakStrukRefundGelangRusak}
      >
        <Printer /> Cetak Struk Refund Gelang Rusak
      </Button>

      <Button
        className="bg-qubu_green"
        disabled={
          isHaveWristbandNotReturnedOpen || !isHaveWristbandDepositNotReturned
        }
        onClick={handleCetakStrukDepositSaja}
      >
        <Printer />
        Cetak Struk Deposit Saja
      </Button>

      <Button
        className="bg-qubu_vivid_blue"
        disabled={isHaveWristbandDepositNotReturned || isWalletSaldoReturned}
        onClick={handleCetakStrukRefund}
      >
        <Printer />
        Cetak Struk Refund
      </Button>
    </div>
  );
}
