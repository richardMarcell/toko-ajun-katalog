"use client";

import { ProductQuantityFunctionProps } from "@/types/domains/pos/souvenir/sales/order";

export function QuantityButtonGroup({
  product,
  saleDetailMap,
  addSalesTemporaryItem,
  removeSalesTemporaryItem,
}: {
  product: ProductQuantityFunctionProps;
  saleDetailMap: Map<number, number>;
  addSalesTemporaryItem: (product: ProductQuantityFunctionProps) => void;
  removeSalesTemporaryItem: (product: ProductQuantityFunctionProps) => void;
}) {
  const productQuantity = saleDetailMap.get(Number(product.id)) || 0;

  const isNonStockProduct = product.stock_qty == null;

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={productQuantity == 0}
        onClick={() => removeSalesTemporaryItem(product)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border p-[10px] font-bold disabled:cursor-not-allowed disabled:bg-gray-100"
        // TODO: Investigate and implement a mechanism to handle hydration errors caused by inconsistencies
        //       between the product quantity value on the server and the client.
        // SUGGESTED SOLUTION: Replace the current mechanism in the souvenir module with the one used in the swimsuit rental module.

        suppressHydrationWarning
      >
        {"-"}
      </button>

      <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-gray-100 p-[10px] font-bold">
        {productQuantity}
      </div>

      <button
        onClick={() => addSalesTemporaryItem(product)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border bg-qubu_blue p-[10px] font-bold text-white disabled:cursor-not-allowed disabled:bg-blue-400"
        disabled={
          isNonStockProduct ? false : productQuantity == product.stock_qty
        }
      >
        {"+"}
      </button>
    </div>
  );
}
