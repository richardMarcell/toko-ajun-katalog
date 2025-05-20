"use client";

import { storeSalesTemporary } from "@/app/(main)/pos/locker/order/_actions/store-sales-temporary";
import { AlertDialogMessage } from "@/components/internal/AlertDialogMessage";
import { Card, CardContent } from "@/components/ui/card";
import { calculateSalesSummary } from "@/lib/services/sales/calculate-sales-summary";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { defaultSalesTemporary } from "@/repositories/domain/pos/locker/order/default-sales-temporary";
import {
  Product,
  ProductQuantityFunctionProps,
  SaleDetail,
  SalesTemporary,
} from "@/types/domains/pos/locker/sales/order";
import { startTransition, useActionState, useEffect, useState } from "react";
import { PanelSaleSummary } from "./panel-sale-summary";
import { ProductListOrder } from "./product-list-order";
import { SwitchToggleProductListDisplay } from "./switch-toggle-product-list-display";

export function PanelOrder({
  products,
  totalProducts,
  salesTemporary,
}: {
  products: Product[];
  totalProducts: number;
  salesTemporary: SalesTemporary | null;
}) {
  const [state, formAction] = useActionState(storeSalesTemporary, initialValue);

  const [salesTemporaryInput, setSalesTemporaryInput] =
    useState<SalesTemporary>(salesTemporary ?? defaultSalesTemporary);
  const [isError, setIsError] = useState<boolean>(false);

  const updateSalesDetails = (
    salesDetails: SaleDetail[],
    product: ProductQuantityFunctionProps,
    changeQty: number,
  ) => {
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
        product_id: productId,
        qty: 1,
        price: Number(product.price),
        note: null,
        product_name: product.name,
        product_image: product.image,
        product_stock_qty: product.stock_qty,
      });
    }

    return Array.from(salesDetailsMap.values());
  };

  const addSalesTemporaryItem = (product: ProductQuantityFunctionProps) => {
    const updatedSalesDetails = updateSalesDetails(
      salesTemporaryInput.sales_details,
      product,
      1,
    );

    const salesSummaryCalculated = calculateSalesSummary({
      salesDetails: updatedSalesDetails,
      discountAmount: 0,
      taxPercent: 0,
    });

    setSalesTemporaryInput({
      ...salesTemporaryInput,
      sales_details: updatedSalesDetails,
      total_gross: salesSummaryCalculated.total_gross,
      total_net: salesSummaryCalculated.total_net,
      grand_total: salesSummaryCalculated.grand_total,
    });
  };

  const removeSalesTemporaryItem = (product: ProductQuantityFunctionProps) => {
    const updatedSalesDetails = updateSalesDetails(
      salesTemporaryInput.sales_details,
      product,
      -1,
    );

    const salesSummaryCalculated = calculateSalesSummary({
      salesDetails: updatedSalesDetails,
      discountAmount: 0,
      taxPercent: 0,
    });

    setSalesTemporaryInput({
      ...salesTemporaryInput,
      sales_details: updatedSalesDetails,
      total_gross: salesSummaryCalculated.total_gross,
      total_net: salesSummaryCalculated.total_net,
      grand_total: salesSummaryCalculated.grand_total,
    });
  };

  const handleSubmitSalesTemporary = () => {
    startTransition(() => {
      const formData = new FormData();
      Object.entries(salesTemporaryInput).forEach(([key, value]) => {
        const formattedValue = Array.isArray(value)
          ? JSON.stringify(value)
          : (value?.toString() ?? "");

        formData.append(key, formattedValue);
      });

      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status == "error") setIsError(true);
  }, [state]);

  const saleDetailMap = new Map(
    salesTemporaryInput.sales_details.map((detail) => [
      detail.product_id,
      detail.qty,
    ]),
  );

  return (
    <Card className="w-full px-4 py-5">
      <CardContent className="flex gap-4 p-2">
        <div className="w-[75%]">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl">All Items ({totalProducts})</h1>
            <SwitchToggleProductListDisplay />
          </div>
          <ProductListOrder
            addSalesTemporaryItem={addSalesTemporaryItem}
            products={products}
            saleDetailMap={saleDetailMap}
            salesTemporaryInput={salesTemporaryInput}
            removeSalesTemporaryItem={removeSalesTemporaryItem}
          />
        </div>

        <PanelSaleSummary
          salesTemporaryInput={salesTemporaryInput}
          setSalesTemporaryInput={setSalesTemporaryInput}
          saleDetailMap={saleDetailMap}
          addSalesTemporaryItem={addSalesTemporaryItem}
          removeSalesTemporaryItem={removeSalesTemporaryItem}
          handleSubmitSalesTemporary={handleSubmitSalesTemporary}
        />

        <AlertDialogMessage
          message={Object.values(state.errors ?? {})[0]}
          isOpen={isError}
          type={"error"}
          onClose={() => setIsError(false)}
        />
      </CardContent>
    </Card>
  );
}
