"use client";

import { useSwimsuitRentContext } from "@/contexts/swimsuit-rent-context";
import { calculateSalesSummary } from "@/lib/services/sales/calculate-sales-summary";
import { Product, SaleDetail } from "@/types/domains/swimsuit-rent/general";

export function QuantityButtonGroup({ product }: { product: Product }) {
  const {
    saleDetailProductQtyMap,
    setSwimsuitRentTemporaryInput,
    swimsuitRentTemporaryInput,
  } = useSwimsuitRentContext();

  const productQty = saleDetailProductQtyMap.get(Number(product.id)) ?? 0;

  const addSwimsuitRentTemporaryItem = (product: Product): void => {
    const updatedSalesDetails = updateSalesDetails(
      swimsuitRentTemporaryInput.sales_details,
      product,
      1,
    );

    const salesSummaryCalculated = calculateSalesSummary({
      salesDetails: updatedSalesDetails,
      discountAmount: 0,
      taxPercent: 0,
    });

    setSwimsuitRentTemporaryInput({
      ...swimsuitRentTemporaryInput,
      sales_details: updatedSalesDetails,
      total_gross: salesSummaryCalculated.total_gross,
      total_net: salesSummaryCalculated.total_net,
      grand_total: salesSummaryCalculated.grand_total,
    });
  };

  const removeSwimsuitRentTemporaryItem = (product: Product): void => {
    const updatedSalesDetails = updateSalesDetails(
      swimsuitRentTemporaryInput.sales_details,
      product,
      -1,
    );

    const salesSummaryCalculated = calculateSalesSummary({
      salesDetails: updatedSalesDetails,
      discountAmount: 0,
      taxPercent: 0,
    });

    setSwimsuitRentTemporaryInput({
      ...swimsuitRentTemporaryInput,
      sales_details: updatedSalesDetails,
      total_gross: salesSummaryCalculated.total_gross,
      total_net: salesSummaryCalculated.total_net,
      grand_total: salesSummaryCalculated.grand_total,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => removeSwimsuitRentTemporaryItem(product)}
        disabled={productQty == 0}
        className="flex h-8 w-8 items-center justify-center rounded-lg border p-[10px] font-bold disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        {"-"}
      </button>

      <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-gray-100 p-[10px] font-bold">
        {productQty}
      </div>

      <button
        onClick={() => addSwimsuitRentTemporaryItem(product)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border bg-qubu_blue p-[10px] font-bold text-white disabled:cursor-not-allowed disabled:bg-blue-400"
        disabled={productQty == product.stock_qty}
      >
        {"+"}
      </button>
    </div>
  );
}

const updateSalesDetails = (
  salesDetails: SaleDetail[],
  product: Product,
  changeQty: number,
): SaleDetail[] => {
  const salesDetailsMap = new Map(
    salesDetails.map((detail) => [detail.product_id, detail]),
  );
  const productId = Number(product.id);

  if (salesDetailsMap.has(productId)) {
    const item = salesDetailsMap.get(productId)!;
    const newQty = item.qty + changeQty;

    if (newQty > 0) {
      salesDetailsMap.set(productId, { ...item, qty: newQty });
    } else {
      salesDetailsMap.delete(productId);
    }
  } else if (changeQty > 0) {
    salesDetailsMap.set(productId, {
      product_id: Number(product.id),
      product_code: product.code,
      product_name: product.name,
      product_description: product.description,
      price: Number(product.price),
      product_image: product.image,
      product_stock_qty: product?.stock_qty ?? 0,
      qty: 1,
    });
  }

  return Array.from(salesDetailsMap.values());
};
