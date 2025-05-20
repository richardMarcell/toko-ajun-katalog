"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOrderTypeCase, OrderTypeEnum } from "@/lib/enums/OrderTypeEnum";
import { cn, formatNumberToCurrency } from "@/lib/utils";
import { defaultSalesTemporary } from "@/repositories/domain/pos/food-corner/order/default-sales-temporary";
import { useSidebarStore } from "@/store/useSidebarStore";
import {
  Product,
  ProductQuantityFunctionProps,
  SalesTemporary,
} from "@/types/domains/pos/food-corner/sales/order";
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
  const updateNote = (product: Pick<Product, "id">, note: string) => {
    const salesDetailsMap = new Map(
      salesTemporaryInput.sales_details.map((detail) => [
        detail.product_id,
        detail,
      ]),
    );

    if (salesDetailsMap.has(Number(product.id))) {
      const salesDetailMapItem = salesDetailsMap.get(Number(product.id))!;
      salesDetailsMap.set(Number(product.id), {
        ...salesDetailMapItem,
        note,
      });
    }

    setSalesTemporaryInput({
      ...salesTemporaryInput,
      sales_details: Array.from(salesDetailsMap.values()),
    });
  };

  return (
    <div className="w-[35%] space-y-3" data-testid="panel-sale-summary">
      <Button
        onClick={() => setSalesTemporaryInput(defaultSalesTemporary)}
        className="w-full p-2"
      >
        {"+ Create New Order"}
      </Button>

      <Card className="border p-4">
        <div className="flex gap-2 pt-4">
          {Object.entries(OrderTypeEnum).map(([key, orderType]) => {
            const isSelected = salesTemporaryInput.order_type == orderType;
            return (
              <Badge
                key={key}
                variant={"outline"}
                className={cn(
                  "cursor-pointer border-[3px] border-qubu_gray text-qubu_dark_gray",
                  isSelected ? "border-blue-400 text-qubu_blue" : "",
                )}
                onClick={() =>
                  setSalesTemporaryInput({
                    ...salesTemporaryInput,
                    order_type: orderType,
                  })
                }
                data-testid={`order-type-badge-${orderType}`}
              >
                {getOrderTypeCase(orderType)}
              </Badge>
            );
          })}
        </div>

        <div className="max-h-[270px] pt-4">
          {salesTemporaryInput.sales_details.length === 0 && (
            <div className="p-4 text-center text-gray-300">
              <span className="block w-full border-b-4 border-dashed pb-2">
                No Item Selected
              </span>
            </div>
          )}
          <ScrollArea className="h-[270px]">
            <div className="space-y-4" data-testid="cart-product-list">
              {salesTemporaryInput.sales_details.map((detail) => {
                const subtotal = detail.price * detail.qty;

                const product = {
                  id: BigInt(detail.product_id),
                  price: detail.price.toString(),
                  name: detail.product_name || "",
                  image: detail.product_image || "",
                  tenant: detail.tenant || "",
                  stock_qty: detail.product_stock_qty || null,
                };

                return (
                  <div
                    key={detail.product_id}
                    data-testid={`cart-product-item`}
                  >
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
                        <Input
                          type="text"
                          placeholder="additional notes"
                          className="w-full rounded-lg border px-2 py-1"
                          autoComplete="off"
                          onChange={(e) => updateNote(product, e.target.value)}
                        />
                      </div>
                    </div>
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
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="mt-4 space-y-4 rounded-lg border bg-gray-100 p-3 text-gray-500">
          {salesTemporaryInput.order_type === OrderTypeEnum.DINE_IN && (
            <div className="border-b-2 border-dashed pb-4">
              <Select
                onValueChange={(nomorMeja: string) =>
                  setSalesTemporaryInput({
                    ...salesTemporaryInput,
                    table_number: nomorMeja,
                  })
                }
                value={salesTemporaryInput.table_number ?? ""}
              >
                <SelectTrigger
                  className="mt-4 w-full bg-white"
                  data-testid="input-table-number"
                >
                  <SelectValue placeholder="Pilih nomor meja" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.from({ length: 20 }, (_, i) => {
                      const nomorMeja = (i + 1).toString().padStart(3, "0");
                      return (
                        <SelectItem key={nomorMeja} value={nomorMeja}>
                          {nomorMeja}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

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
