"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatNumberToCurrency } from "@/lib/utils";
import { Product } from "@/types/domains/swimsuit-rent/general";
import Image from "next/image";
import { QuantityButtonGroup } from "./quantity-button-group";

export function CardProduct({ product }: { product: Product }) {
  return (
    <Card className="p-3">
      <CardContent className="p-2">
        <div className="flex gap-4">
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={200}
            className="aspect-square h-[88px] w-[88px] rounded-lg object-contain p-1"
          />
          <div className="space-y-4">
            <div>
              <h1 className="font-medium">{product.name}</h1>
              <p className="h-18 line-clamp-4 text-xs">{product.description}</p>
            </div>
            <div>
              <p className="w-fit rounded-full py-1 text-sm font-semibold">{`Stok tersedia: ${product.stock_qty}`}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <span className="font-medium">
            {formatNumberToCurrency(Number(product.price))}
          </span>

          <QuantityButtonGroup product={product} />
        </div>
      </CardContent>
    </Card>
  );
}
