"use client";

import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatNumberToCurrency } from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, {
  BaseSyntheticEvent,
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { upsertCaptainOrderDetail } from "../_actions/upsert-captain-order-detail";
import { CaptainOrderDetailIncludeRelationship } from "../_types/edit";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ProductWithStock } from "../../../../_repositories/get-products";

export function DialogFormOrderProduct({
  product,
  orderedProduct,
  disabled,
  children,
}: {
  product: ProductWithStock;
  orderedProduct?: CaptainOrderDetailIncludeRelationship;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const { captainOrderId } = useParams();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [state, formAction] = useActionState(
    upsertCaptainOrderDetail,
    initialValue,
  );

  const [captainOrderDetail, setCaptainOrderDetail] = useState<{
    captain_order_detail_id?: bigint;
    product_id: bigint;
    qty: number;
    note: string;
    previous_qty: number;
    authorization_code: string;
  }>({
    captain_order_detail_id: orderedProduct ? orderedProduct.id : undefined,
    product_id: product.id,
    qty: orderedProduct ? orderedProduct.qty : 0,
    note: orderedProduct && orderedProduct.note ? orderedProduct.note : "",
    previous_qty: orderedProduct ? orderedProduct.qty : 0,
    authorization_code: "",
  });

  const updateCaptainOrderQuantityProduct = (changeQty: number) => {
    setCaptainOrderDetail((prev) => {
      const newQty = Math.max(0, prev.qty + changeQty);
      return { ...prev, qty: newQty };
    });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      if (captainOrderId)
        formData.set("captain_order_id", captainOrderId.toString());

      if (captainOrderDetail.captain_order_detail_id)
        formData.set(
          "captain_order_detail_id",
          captainOrderDetail.captain_order_detail_id.toString(),
        );

      formData.set("product_id", captainOrderDetail.product_id.toString());
      formData.set("qty", captainOrderDetail.qty.toString());
      formData.set("note", captainOrderDetail.note?.toString() ?? "");
      formData.set("authorization_code", captainOrderDetail.authorization_code);

      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 3000,
      });
    }

    if (state.status == "success") {
      setIsOpen(false);

      setCaptainOrderDetail({
        captain_order_detail_id: orderedProduct ? orderedProduct.id : undefined,
        product_id: product.id,
        qty: orderedProduct ? orderedProduct.qty : 0,
        note: orderedProduct && orderedProduct.note ? orderedProduct.note : "",
        previous_qty: orderedProduct ? orderedProduct.qty : 0,
        authorization_code: "",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger
        className={cn(disabled ? "pointer-events-none" : "")}
        asChild
      >
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Item's Detail"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Image
              src={product.image}
              alt={product.name}
              width={200}
              height={200}
              className="aspect-square h-[88px] w-[88px] rounded-lg object-contain p-1"
            />
            <div>
              <h1 className="font-medium">{product.name}</h1>
              <p className="line-clamp-5 max-h-24 text-xs">
                {product.description}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between">
              <span className="text-2xl font-bold text-qubu_blue">
                {formatNumberToCurrency(Number(product.price))}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCaptainOrderQuantityProduct(-1)}
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border p-[10px] font-bold disabled:cursor-not-allowed disabled:bg-gray-100"
                  disabled={captainOrderDetail.qty === 0}
                >
                  {"-"}
                </button>

                <div
                  className="flex h-8 w-24 items-center justify-center rounded-lg border bg-gray-100 p-[10px] font-bold"
                  data-testid="qty-display"
                >
                  {captainOrderDetail.qty}
                </div>

                <button
                  disabled={captainOrderDetail.qty == product.stock_qty}
                  onClick={() => updateCaptainOrderQuantityProduct(1)}
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border bg-qubu_blue p-[10px] font-bold text-white disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {"+"}
                </button>
              </div>
            </div>
            {state.errors?.qty && (
              <ValidationErrorMessage
                errorMessage={state.errors.qty.toString()}
              />
            )}
          </div>

          <Textarea
            onChange={(e: BaseSyntheticEvent) =>
              setCaptainOrderDetail({
                ...captainOrderDetail,
                note: e.target.value,
              })
            }
            value={captainOrderDetail.note ?? ""}
            placeholder="Add notes to your order"
          />

          {captainOrderDetail.previous_qty > captainOrderDetail.qty && (
            <div className="flex flex-col items-center space-y-2 pt-8">
              <InputOTP
                onChange={(value: string) =>
                  setCaptainOrderDetail({
                    ...captainOrderDetail,
                    authorization_code: value,
                  })
                }
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
              >
                <InputOTPGroup>
                  <InputOTPSlot className="border-black p-6" index={0} />
                  <InputOTPSlot className="border-black p-6" index={1} />
                  <InputOTPSlot className="border-black p-6" index={2} />
                  <InputOTPSlot className="border-black p-6" index={3} />
                  <InputOTPSlot className="border-black p-6" index={4} />
                  <InputOTPSlot className="border-black p-6" index={5} />
                </InputOTPGroup>
              </InputOTP>
              <div className="text-center text-sm">
                Masukkan kode autorisasi.
              </div>
              {state.errors?.authorization_code && (
                <ValidationErrorMessage
                  errorMessage={state.errors.authorization_code.toString()}
                />
              )}
            </div>
          )}

          <Button className="w-full" type="submit">
            Tambahkan Pesanan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
