"use client";

import { formatNumberToCurrency } from "@/lib/utils";
import { Product } from "@/types/product";
import Image from "next/image";
import { DialogFormOrderProduct } from "./dialog-form-order-product";

export function ProductCard({
  product,
  isUserAuthorizeToShop,
}: {
  product: Product;
  isUserAuthorizeToShop: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-white p-2 shadow-sm transition hover:border-[#C4E980] hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain p-4"
        />
      </div>

      <div className="space-y-1 p-4">
        <h3 className="text-lg font-semibold text-[#204B4E]">{product.name}</h3>
        <p className="line-clamp-2 min-h-[2.75rem] text-sm">
          {product.description}
        </p>
        <p className="text-base font-bold text-[#3B5D5F]">
          {formatNumberToCurrency(Number(product.price))}
        </p>
      </div>

      {isUserAuthorizeToShop && (
        <div className="absolute bottom-4 right-4">
          <DialogFormOrderProduct product={product} />
        </div>
      )}
    </div>
  );
}
