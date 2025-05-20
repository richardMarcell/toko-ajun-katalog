"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductConfig } from "@/lib/config/product-config";
import { formatNumberToCurrency, getCurrentDate } from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { SpecialItemExtras } from "@/types/special-item-extras";
import Image from "next/image";
import { redirect, useSearchParams } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { storeRestoSalesTemporary } from "../_actions/store-resto-sales-temporary";
import {
  CaptainOrderDetailIncludeRelationship,
  CaptainOrderIncludeRelationship,
} from "../_types/edit";

type SaleDetail = {
  captain_order_detail_id: number;
  product_id: number;
  product_name: string;
  qty: number;
  price: number;
  note?: string | null;
};

type RestoSalesTemporary = {
  captain_order_id: number;
  sales_details: SaleDetail[];
  total_gross: number;
  total_net: number;
  grand_total: number;
  tax_percent: number;
  tax_amount: number;
  discount_percent: number;
  discount_amount: number;
  created_at: Date;
};

export function DialogConfirmationPaidItem({
  captainOrder,
}: {
  captainOrder: CaptainOrderIncludeRelationship;
}) {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [state, formAction] = useActionState(
    storeRestoSalesTemporary,
    initialValue,
  );

  const [restoSalesTemporary, setRestoSalesTemporary] =
    useState<RestoSalesTemporary>({
      captain_order_id: Number(captainOrder.id),
      sales_details: mapToSalesDetails(captainOrder.captainOrderDetails),
      total_gross: 0,
      total_net: 0,
      grand_total: 0,
      tax_percent: 0,
      tax_amount: 0,
      discount_percent: 0,
      discount_amount: 0,
      created_at: getCurrentDate(),
    });

  const handleButtonPayOnClick = () => {
    startTransition(() => {
      const formData = new FormData();
      const promoCode = searchParams.get("promoCode") ?? "";
      formData.set("captain_order_id", captainOrder.id.toString());
      formData.set(
        "sales_details",
        JSON.stringify(restoSalesTemporary.sales_details),
      );
      formData.set("promo_code", promoCode);

      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 3000,
      });
    }

    if (state.status && state.url && state.data) {
      sessionStorage.setItem(
        `resto-sales-temporary-${captainOrder.id}`,
        JSON.stringify(state.data),
      );
      redirect(state.url);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 w-full bg-qubu_blue p-2" type="button">
          Bayar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Konfirmasi Jumlah Paid Item
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px]">
          <div className="space-y-8">
            {captainOrder.captainOrderDetails.map((detail) => (
              <CardProduct
                restoSalesTemporary={restoSalesTemporary}
                setRestoSalesTemporary={setRestoSalesTemporary}
                captainOrderDetail={detail}
                key={detail.id}
              />
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            onClick={handleButtonPayOnClick}
            className="w-full bg-qubu_blue"
          >
            Bayar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CardProduct({
  captainOrderDetail,
  restoSalesTemporary,
  setRestoSalesTemporary,
}: {
  captainOrderDetail: CaptainOrderDetailIncludeRelationship;
  restoSalesTemporary: RestoSalesTemporary;
  setRestoSalesTemporary: Dispatch<SetStateAction<RestoSalesTemporary>>;
}) {
  const selectedCaptainOrderDetailId = Number(captainOrderDetail.id);
  const selectedProductId = Number(captainOrderDetail.product_id);

  // Check is selected product is special item
  const isSpecialItem =
    selectedProductId === Number(ProductConfig.special_item.id);

  // Get extras attribute
  const extrasSpecialItem = captainOrderDetail.extras as SpecialItemExtras;

  // Set Product name, is special item get product name from extra special item
  const selectedProductName = isSpecialItem
    ? extrasSpecialItem.name
    : captainOrderDetail.product.name;

  const orderedProduct = restoSalesTemporary.sales_details.find(
    (item) => item.captain_order_detail_id === selectedCaptainOrderDetailId,
  );

  const orderedProductQty = orderedProduct?.qty ?? 0;
  const orderedProductMaxQty =
    captainOrderDetail.qty - captainOrderDetail.paid_qty;

  const handleProductQtyChange = (changeQty: number) => {
    const orderedProducts = [...restoSalesTemporary.sales_details];
    const existingIndex = orderedProducts.findIndex(
      (item) => item.captain_order_detail_id === selectedCaptainOrderDetailId,
    );

    if (existingIndex === -1 && changeQty === 1) {
      orderedProducts.push({
        captain_order_detail_id: selectedCaptainOrderDetailId,
        note: captainOrderDetail.note,
        price: Number(captainOrderDetail.price),
        product_id: selectedProductId,
        product_name: selectedProductName,
        qty: 1,
      });
    } else if (existingIndex !== -1) {
      const item = orderedProducts[existingIndex];
      const newQty = item.qty + changeQty;

      if (newQty <= 0) {
        orderedProducts.splice(existingIndex, 1);
      } else {
        orderedProducts[existingIndex] = {
          ...item,
          qty: newQty,
        };
      }
    }

    setRestoSalesTemporary({
      ...restoSalesTemporary,
      sales_details: orderedProducts,
    });
  };

  return (
    <div>
      <div className="flex gap-4">
        <Image
          src={captainOrderDetail.product.image}
          alt={selectedProductName}
          width={200}
          height={200}
          className="aspect-square h-[88px] w-[88px] rounded-lg border object-contain p-1"
        />
        <div className="w-full space-y-2">
          <h1 className="font-bold">{selectedProductName}</h1>
          <Input
            type="text"
            placeholder="additional notes"
            className="w-full rounded-lg border px-2 py-1"
            disabled
            value={captainOrderDetail.note || "-"}
          />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleProductQtyChange(-1)}
            disabled={orderedProductQty === 0}
            className="flex h-8 w-8 items-center justify-center rounded-lg border p-[10px] font-bold disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            -
          </button>

          <div
            className="flex h-8 w-24 items-center justify-center rounded-lg border bg-gray-100 p-[10px] font-bold"
            data-testid="qty-display"
          >
            {orderedProductQty}
          </div>

          <button
            type="button"
            onClick={() => handleProductQtyChange(1)}
            disabled={orderedProductQty >= orderedProductMaxQty}
            className="flex h-8 w-8 items-center justify-center rounded-lg border bg-qubu_blue p-[10px] font-bold text-white disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            +
          </button>
        </div>

        <span className="font-medium">
          {formatNumberToCurrency(
            orderedProductQty * Number(captainOrderDetail.price),
          )}
        </span>
      </div>
    </div>
  );
}

function mapToSalesDetails(
  details: CaptainOrderDetailIncludeRelationship[],
): SaleDetail[] {
  return details.map((detail) => {
    const totalOrderQty = detail.qty - detail.paid_qty;
    const isSpecialItem = detail.product_id === ProductConfig.special_item.id;

    const specialItemExtras = detail.extras as SpecialItemExtras;

    return {
      captain_order_detail_id: Number(detail.id),
      product_id: Number(detail.product_id),
      product_name: isSpecialItem
        ? specialItemExtras.name
        : detail.product.name,
      price: Number(detail.price),
      qty: totalOrderQty,
      note: detail.note,
    };
  });
}
