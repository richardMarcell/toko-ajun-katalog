"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { Slash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { updateSaldoWalletTemporary } from "../_actions/update-saldo-wallet-temporary";
import FormTopUpWallet from "./form-top-up-wallet";
import PanelTopUpSummary from "./panel-top-up-summary";

type TopUpCashQType = {
  amount: number;
  current_saldo: number;
  wristband_code: string;
};

type WalletType = {
  id: bigint;
  saldo: string;
  walletWristbands: WalletWristbandType[];
};

type WalletWristbandType = {
  wristband_code: string;
};

export default function PanelTopUp({ wallet }: { wallet: WalletType }) {
  const initialTopUpWalletValue: TopUpCashQType = {
    amount: 0,
    current_saldo: Number(wallet.saldo),
    wristband_code: wallet.walletWristbands
      .map((walletWristband) => walletWristband.wristband_code)
      .join(", "),
  };

  const topUpWalletTemporary: TopUpCashQType = JSON.parse(
    sessionStorage.getItem(`cashq-top-up-${wallet.id}`) as string,
  );
  const [topUpWallet, setTopUpWallet] = useState<TopUpCashQType>(
    topUpWalletTemporary ?? initialTopUpWalletValue,
  );
  const [state, formAction] = useActionState(
    updateSaldoWalletTemporary,
    initialValue,
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("wallet_id", wallet.id.toString());
      formData.set("amount", topUpWallet.amount.toString());
      formData.set("current_saldo", topUpWallet.current_saldo.toString());
      formData.set("wristband_code", topUpWallet.wristband_code);

      formAction(formData);
    });
  };

  const handleCancel = () => {
    if (sessionStorage.getItem(`cashq-top-up-${wallet.id}`))
      sessionStorage.removeItem(`cashq-top-up-${wallet.id}`);

    setTopUpWallet(initialTopUpWalletValue);
    redirect("/cashq-transaction");
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 2000,
      });
    }

    if (state.status == "success") {
      sessionStorage.setItem(
        `cashq-top-up-${wallet.id}`,
        JSON.stringify(topUpWallet),
      );
      redirect("top-up/sales/create");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form onSubmit={onSubmit}>
      <Card className="w-full px-4 py-5">
        <CardContent className="flex gap-4 p-2">
          <div className="w-[60%]">
            <div className="justify-between border-b border-b-gray-200 pb-4">
              <h1 className="text-2xl font-semibold">Top-Up CashQ</h1>
              <BreadcrumbPage />
            </div>
            <FormTopUpWallet
              state={state}
              topUpWallet={topUpWallet}
              setWristbandRent={setTopUpWallet}
            />
          </div>
          <PanelTopUpSummary
            topUpWallet={topUpWallet}
            handleCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </form>
  );
}

function BreadcrumbPage() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href="/cashq-transaction">Transaksi Terbuka</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Top-Up</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
