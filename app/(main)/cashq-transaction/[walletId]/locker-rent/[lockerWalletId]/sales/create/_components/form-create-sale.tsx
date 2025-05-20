"use client";

import FormMultiplePayments from "@/components/internal/domains/form-multiple-payments";
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
import { Label } from "@/components/ui/label";
import { formatNumberToCurrency } from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { WristbandRentTemporaryType } from "@/types/domains/wristband-rent/general";
import { PaymentMultiple } from "@/types/payment-multiple";
import { Ban, Printer } from "lucide-react";
import { redirect } from "next/navigation";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { storeWallet } from "../_actions/store-wallet";
import TableListWristbandRent from "./table-list-wristband-rent";
import getPaymentMethod from "@/lib/services/payments/get-payment-method";

export default function FormCreateSale({
  walletId,
  lockerWalletId,
}: {
  walletId: string;
  lockerWalletId: string;
}) {
  const wristbandRentTemporary: WristbandRentTemporaryType = JSON.parse(
    sessionStorage.getItem(
      `{cashq-transaction-add-wristband-wallet-id-${walletId}}`,
    ) as string,
  );
  const [state, formAction] = useActionState(storeWallet, initialValue);

  const grandTotal = wristbandRentTemporary.deposit_amount;

  const [payments, setPayments] = useState<PaymentMultiple[]>([]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);

      formData.set("wallet_id", walletId);
      formData.set("locker_wallet_id", lockerWalletId);
      formData.append(
        "wristband_rent",
        sessionStorage.getItem(
          `{cashq-transaction-add-wristband-wallet-id-${walletId}}`,
        ) as string,
      );
      formData.append("payments", JSON.stringify(payments));

      formAction(formData);
    });
  };

  const handleCancel = () => {
    if (
      sessionStorage.getItem(
        `{cashq-transaction-add-wristband-wallet-id-${walletId}}`,
      )
    )
      sessionStorage.removeItem(
        `{cashq-transaction-add-wristband-wallet-id-${walletId}}`,
      );

    redirect(
      `/cashq-transaction/${walletId}/locker-rent/${lockerWalletId}/edit`,
    );
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 2000,
      });
    }

    if (state.status == "success") {
      sessionStorage.removeItem(
        `{cashq-transaction-add-wristband-wallet-id-${walletId}}`,
      );
      redirect(state.url as string);
    }
  }, [state, walletId]);

  return (
    <div>
      <TableListWristbandRent
        walletId={walletId}
        lockerWalletId={lockerWalletId}
        wristbandRentTemporary={wristbandRentTemporary}
      />

      <form onSubmit={onSubmit} className="pt-8">
        <div className="spcey-4 border-b-4 border-dashed pb-8">
          <div className="flex justify-between">
            <Label className="font-normal">Total</Label>
            <div>
              {formatNumberToCurrency(wristbandRentTemporary.deposit_amount)}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="flex justify-between">
            <Label className="text-xl font-bold">Total Pembayaran</Label>
            <div className="text-xl font-bold">
              {formatNumberToCurrency(grandTotal)}
            </div>
          </div>
          <FormMultiplePayments
            payments={payments}
            setPayments={setPayments}
            grandTotal={grandTotal}
            state={state}
            paymentMethodList={getPaymentMethod()}
          />
        </div>

        <div className="flex gap-2 pt-8">
          <Button
            type="submit"
            className="flex items-center justify-center gap-2"
          >
            <Printer />
            <span>Bayar & Cetak Struk</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant={"destructive"}
                className="flex items-center justify-center gap-2"
              >
                <Ban />
                <span>Batal & Hapus Transaksi</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Konfirmasi Pembatalan Transaksi
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Anda akan membatalkan transaksi atas nama{" "}
                  <strong>{wristbandRentTemporary.customer_name}</strong>.
                  Tindakan ini akan menghapus seluruh data terkait transaksi ini
                  dan tidak dapat dikembalikan. Apakah Anda yakin ingin
                  melanjutkan?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  onClick={handleCancel}
                  type="button"
                  variant={"destructive"}
                >
                  <span>Batal & Hapus Transaksi</span>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </div>
  );
}
