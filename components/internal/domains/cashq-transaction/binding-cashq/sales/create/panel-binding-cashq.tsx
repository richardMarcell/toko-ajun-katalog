"use client";
import storeBindingCashQ from "@/app/(main)/cashq-transaction/[walletId]/binding-cashq/sales/create/_actions/store-binding-cashq";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { Product } from "@/types/product";
import { ArrowLeft, Slash } from "lucide-react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import FormCreateBindingCashQ from "./form-create-binding-cashq";
import PanelBindingCashQSummary from "./panel-binding-cashq-summary";
import { PaymentMultiple } from "@/types/payment-multiple";

export type BindingCashQ = {
  quantity: number;
  deposit_amount: number;
  wristband_code_list: string[];
};

const initialBindingCashQ: BindingCashQ = {
  quantity: 1,
  deposit_amount: 0,
  wristband_code_list: [],
};

export function PanelBindingCashQ({
  wristbandProduct,
}: {
  wristbandProduct: Product;
}) {
  const params = useParams();
  const walletId = params.walletId;
  const [state, formAction] = useActionState(storeBindingCashQ, initialValue);
  const [bindingCashQ, setBindingCashQ] =
    useState<BindingCashQ>(initialBindingCashQ);

  const [payments, setPayments] = useState<PaymentMultiple[]>([]);

  useEffect(() => {
    setBindingCashQ((prevState) => ({
      ...prevState,
      deposit_amount: bindingCashQ.quantity * Number(wristbandProduct.price),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bindingCashQ.quantity]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      if (walletId) formData.set("wallet_id", walletId.toString());

      formData.set("quantity", bindingCashQ.quantity.toString());
      formData.set(
        "wristband_code_list",
        JSON.stringify(bindingCashQ.wristband_code_list),
      );
      formData.append("payments", JSON.stringify(payments));

      formAction(formData);
    });
  };

  const handleCancel = () => setBindingCashQ(initialBindingCashQ);

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 2000,
      });
    }

    if (state.status == "success") redirect(state.url ?? "");
  }, [state]);

  return (
    <form onSubmit={onSubmit}>
      <Card className="w-full px-4 py-5">
        <CardContent className="flex gap-4 p-2">
          <div className="w-[60%]">
            <div className="space-y-2">
              <CardTitle className="text-2xl">Binding CashQ</CardTitle>
              <BreadcrumbPage />
              <Button className="w-32" asChild variant={"outline"}>
                <Link
                  className="flex gap-2"
                  href={`/cashq-transaction/${walletId}/binding-cashq`}
                >
                  <ArrowLeft />
                  <span>Kembali</span>
                </Link>
              </Button>
            </div>
            <FormCreateBindingCashQ
              state={state}
              bindingCashQ={bindingCashQ}
              setBindingCashQ={setBindingCashQ}
              payments={payments}
              setPayments={setPayments}
            />
          </div>
          <PanelBindingCashQSummary
            bindingCashQ={bindingCashQ}
            handleCancel={handleCancel}
            payments={payments}
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
        <BreadcrumbItem>CashQ</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
