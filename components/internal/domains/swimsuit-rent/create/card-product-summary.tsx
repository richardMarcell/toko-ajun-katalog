"use client";

import { cn, formatNumberToCurrency } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";
import { SaleDetail } from "@/types/domains/swimsuit-rent/general";
import Image from "next/image";
import { QuantityButtonGroup } from "./quantity-button-group";

export function CardProductSummary({ saleDetail }: { saleDetail: SaleDetail }) {
  const { isCollapsed } = useSidebarStore();
  const subtotal = saleDetail.price * saleDetail.qty;

  return (
    <div key={saleDetail.product_id}>
      <div
        className={cn(
          "flex gap-4",
          isCollapsed ? "" : "flex-col items-center gap-1",
        )}
      >
        <Image
          src={saleDetail.product_image as string}
          alt={saleDetail.product_name as string}
          width={200}
          height={200}
          className="aspect-square h-[88px] w-[88px] rounded-lg object-contain p-1"
        />
        <div className="w-full space-y-2">
          <h1 className="font-medium">{saleDetail.product_name}</h1>
          <div className="flex justify-between pt-2">
            <QuantityButtonGroup
              product={{
                id: BigInt(saleDetail.product_id),
                code: saleDetail.product_code,
                description: saleDetail.product_description,
                name: saleDetail.product_name,
                image: saleDetail.product_image ?? "",
                price: saleDetail.price.toString(),
                stock_qty: saleDetail.product_stock_qty,
              }}
            />

            <span className="font-medium">
              {formatNumberToCurrency(subtotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
