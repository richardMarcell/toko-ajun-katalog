"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatNumberToCurrency } from "@/lib/utils";
import { defaultSalesTemporary } from "@/repositories/domain/pos/food-corner/order/default-sales-temporary";
import { useSidebarStore } from "@/store/useSidebarStore";
import {
  ProductQuantityFunctionProps,
  SalesTemporary,
} from "@/types/domains/pos/souvenir/sales/order";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { QuantityButtonGroup } from "./quantity-button-group";

export function PanelSaleSummary({
  salesTemporaryInput,
  setSalesTemporaryInput,
  saleDetailMap,
  addSalesTemporaryItem,
  removeSalesTemporaryItem,
  handleSubmitSalesTemporary,
}: {
  salesTemporaryInput: SalesTemporary;
  setSalesTemporaryInput: Dispatch<SetStateAction<SalesTemporary>>;
  saleDetailMap: Map<number, number>;
  addSalesTemporaryItem: (product: ProductQuantityFunctionProps) => void;
  removeSalesTemporaryItem: (product: ProductQuantityFunctionProps) => void;
  handleSubmitSalesTemporary: () => void;
}) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="w-[25%] space-y-3">
      <Button
        onClick={() => setSalesTemporaryInput(defaultSalesTemporary)}
        className="w-full p-2"
      >
        {"+ Create New Order"}
      </Button>

      <Card className="border p-4">
        <input
          type="text"
          maxLength={25}
          placeholder="Customer's Name"
          autoComplete="off"
          value={salesTemporaryInput.customer_name ?? ""}
          onChange={(e) =>
            setSalesTemporaryInput({
              ...salesTemporaryInput,
              customer_name: e.target.value,
            })
          }
          className="w-full rounded-md text-xl font-medium placeholder:text-xl placeholder:font-medium focus:border-transparent focus:outline-none"
        />

        <div className="max-h-[410px] pt-4">
          {salesTemporaryInput.sales_details.length === 0 && (
            <div className="p-4 text-center text-gray-300">
              <span className="block w-full border-b-4 border-dashed pb-2">
                No Item Selected
              </span>
            </div>
          )}
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {salesTemporaryInput.sales_details.map((detail) => {
                const subtotal = detail.price * detail.qty;

                const product = {
                  id: BigInt(detail.product_id),
                  price: detail.price.toString(),
                  name: detail.product_name || "",
                  image: detail.product_image || "",
                  stock_qty: detail.product_stock_qty || null,
                };

                return (
                  <div key={detail.product_id}>
                    <div
                      className={cn(
                        "flex gap-4",
                        isCollapsed ? "" : "flex-col items-center gap-1",
                      )}
                    >
                      <Image
                        src={detail.product_image as string}
                        alt={detail.product_name as string}
                        width={200}
                        height={200}
                        className="aspect-square h-[88px] w-[88px] rounded-lg object-contain p-1"
                      />
                      <div className="w-full space-y-2">
                        <h1 className="font-medium">{detail.product_name}</h1>
                        <div className="flex justify-between pt-2">
                          <QuantityButtonGroup
                            saleDetailMap={saleDetailMap}
                            product={product}
                            addSalesTemporaryItem={addSalesTemporaryItem}
                            removeSalesTemporaryItem={removeSalesTemporaryItem}
                          />

                          <span className="font-medium">
                            {formatNumberToCurrency(subtotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="mt-4 space-y-4 rounded-lg border bg-gray-100 p-3 text-gray-500">
          <div className="flex justify-between font-bold">
            <div className="w-20">Total</div>
            <div className="">
              {formatNumberToCurrency(salesTemporaryInput.total_gross)}
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmitSalesTemporary}
          className="mt-4 w-full bg-qubu_blue p-2"
          type="button"
        >
          Order
        </Button>
      </Card>
    </div>
  );
}
