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
import { formatNumberToCurrency } from "@/lib/utils";

import { initialValue } from "@/repositories/initial-value-form-state";
import { Product } from "@/types/product";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import {
  BaseSyntheticEvent,
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { storeCart } from "../_actions/store-cart";

export function DialogFormOrderProduct({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [state, formAction] = useActionState(storeCart, initialValue);

  const [orderedProduct, setOrderedProduct] = useState<{
    product_id: bigint;
    qty: number;
    note: string;
  }>({
    product_id: product.id,
    qty: 0,
    note: "",
  });

  const updateCaptainOrderQuantityProduct = (changeQty: number) => {
    setOrderedProduct((prev) => {
      const newQty = Math.max(0, prev.qty + changeQty);
      return { ...prev, qty: newQty };
    });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    startTransition(() => {
      const formData = new FormData(e.currentTarget);

      formData.set("product_id", orderedProduct.product_id.toString());
      formData.set("qty", orderedProduct.qty.toString());
      formData.set("note", orderedProduct.note?.toString() ?? "");

      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 3000,
      });
      setIsLoading(false);
    }

    if (state.status == "success") {
      setIsOpen(false);
      setOrderedProduct({
        product_id: product.id,
        qty: 0,
        note: "",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-[#C4E980] px-4 py-2 text-xs font-semibold text-[#204B4E] hover:bg-[#D3EDA4]">
          <ShoppingCart size={16} />
          Tambah
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail Item</DialogTitle>
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
              <span className="text-2xl font-bold text-blue-600">
                {formatNumberToCurrency(Number(product.price))}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCaptainOrderQuantityProduct(-1)}
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border p-[10px] font-bold disabled:cursor-not-allowed disabled:bg-gray-100"
                  disabled={orderedProduct.qty === 0}
                >
                  {"-"}
                </button>

                <div
                  className="flex h-8 w-24 items-center justify-center rounded-lg border bg-gray-100 p-[10px] font-bold"
                  data-testid="qty-display"
                >
                  {orderedProduct.qty}
                </div>

                <button
                  onClick={() => updateCaptainOrderQuantityProduct(1)}
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border bg-blue-600 p-[10px] font-bold text-white disabled:cursor-not-allowed disabled:bg-blue-400"
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
              setOrderedProduct({
                ...orderedProduct,
                note: e.target.value,
              })
            }
            value={orderedProduct.note ?? ""}
            placeholder="Tambahkan catatan pada pesanan Anda"
          />

          <Button disabled={isLoading} className="w-full" type="submit">
            {isLoading ? "Menyimpan pesanan...." : "Simpan Pesanan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
