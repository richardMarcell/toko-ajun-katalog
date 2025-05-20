"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatNumberToCurrency } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  CaptainOrderDetailIncludeRelationship,
  CaptainOrderIncludeRelationship,
} from "../_types/edit";

import { Input } from "@/components/ui/input";
import { ProductConfig } from "@/lib/config/product-config";
import Image from "next/image";
import { DialogConfirmationPaidItem } from "./dialog-confirmation-paid-item";
import { DialogFormOrderProduct } from "./dialog-form-order-product";
import { SpecialItemExtras } from "@/types/special-item-extras";

export function PanelOrderSummary({
  captainOrder,
}: {
  captainOrder: CaptainOrderIncludeRelationship;
}) {
  const totalGross = captainOrder.captainOrderDetails.reduce(
    (totalGross, detail) => totalGross + detail.qty * Number(detail.price),
    0,
  );

  return (
    <div className="w-[35%] space-y-3">
      <Card className="border p-4">
        <h1 className="text-xl font-bold">{captainOrder.customer_name}</h1>

        <div className="max-h-[270px] pt-4">
          {captainOrder.captainOrderDetails.length === 0 && (
            <div className="p-4 text-center text-gray-300">
              <span className="block w-full border-b-4 border-dashed pb-2">
                No Item Selected
              </span>
            </div>
          )}
          <ScrollArea className="h-[270px]">
            <div className="space-y-4">
              {captainOrder.captainOrderDetails.map((detail) => {
                const isSpecialitem =
                  detail.product_id === ProductConfig.special_item.id;
                const extrasSpecialItem = detail.extras as SpecialItemExtras;
                const specialItem = {
                  id: detail.product.id,
                  name: extrasSpecialItem?.name,
                  price: detail.price,
                  image: detail.product.image,
                  description: "-",
                };

                const product = isSpecialitem ? specialItem : detail.product;
                return (
                  <DialogFormOrderProduct
                    disabled={captainOrder.is_closed}
                    product={product}
                    key={detail.id}
                    orderedProduct={detail}
                  >
                    <div>
                      <CardProduct
                        captainOrderDetail={detail}
                        key={detail.id}
                      />
                    </div>
                  </DialogFormOrderProduct>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="mt-4 space-y-4 rounded-lg border bg-gray-100 p-3 text-gray-500">
          <div className="flex justify-between font-bold">
            <div className="w-20">Total</div>
            <div className="">{formatNumberToCurrency(totalGross)}</div>
          </div>
        </div>

        {captainOrder.is_closed && (
          <DialogConfirmationPaidItem captainOrder={captainOrder} />
        )}

        <Button
          variant={"secondary"}
          asChild
          className="mt-4 w-full p-2"
          type="button"
        >
          <Link className="flex gap-2" href={"/pos/resto/patio/tables"}>
            <ArrowLeft />
            <span>Kembali</span>
          </Link>
        </Button>
      </Card>
    </div>
  );
}

function CardProduct({
  captainOrderDetail,
}: {
  captainOrderDetail: CaptainOrderDetailIncludeRelationship;
}) {
  const isSpecialItem =
    captainOrderDetail.product_id == ProductConfig.special_item.id;

  const extrasSpecialItem = captainOrderDetail.extras as SpecialItemExtras;
  return (
    <div className="cursor-pointer">
      <div className={cn("flex gap-4")}>
        <Image
          src={captainOrderDetail.product.image}
          alt={captainOrderDetail.product.name}
          width={200}
          height={200}
          className="aspect-square h-[88px] w-[88px] rounded-lg object-contain p-1"
        />
        <div className="w-full space-y-2">
          <h1 className="font-medium">
            {isSpecialItem
              ? extrasSpecialItem.name
              : captainOrderDetail.product.name}
          </h1>
          <Input
            type="text"
            placeholder="additional notes"
            className="w-full rounded-lg border px-2 py-1"
            readOnly
            value={captainOrderDetail.note ? captainOrderDetail.note : "-"}
          />
        </div>
      </div>
      <div className="flex justify-between pt-2">
        <span className="font-medium">
          {formatNumberToCurrency(Number(captainOrderDetail.subtotal))}
        </span>
      </div>
    </div>
  );
}
