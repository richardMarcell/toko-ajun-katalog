"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatNumberToCurrency } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";
import {
  Product,
  ProductQuantityFunctionProps,
  SalesTemporary,
} from "@/types/domains/pos/locker/sales/order";
import { useSearchParams } from "next/navigation";
import { CardProduct } from "./card-product";
import { QuantityButtonGroup } from "./quantity-button-group";

export function ProductListOrder({
  products,
  salesTemporaryInput,
  saleDetailMap,
  addSalesTemporaryItem,
  removeSalesTemporaryItem,
}: {
  products: Product[];
  salesTemporaryInput: SalesTemporary;
  saleDetailMap: Map<number, number>;
  addSalesTemporaryItem: (product: ProductQuantityFunctionProps) => void;
  removeSalesTemporaryItem: (product: ProductQuantityFunctionProps) => void;
}) {
  const searchParams = useSearchParams();
  const displayMode = searchParams.get("displayMode") || "CARD";

  if (displayMode === "TABLE")
    return (
      <TabContentWithDisplayModeTable
        saleDetailMap={saleDetailMap}
        addSalesTemporaryItem={addSalesTemporaryItem}
        products={products}
        removeSalesTemporaryItem={removeSalesTemporaryItem}
      />
    );
  else
    return (
      <TabContentWithDisplayModeCard
        saleDetailMap={saleDetailMap}
        addSalesTemporaryItem={addSalesTemporaryItem}
        products={products}
        removeSalesTemporaryItem={removeSalesTemporaryItem}
        salesTemporaryInput={salesTemporaryInput}
      />
    );
}

function TabContentWithDisplayModeCard({
  products,
  saleDetailMap,
  addSalesTemporaryItem,
  removeSalesTemporaryItem,
}: {
  products: Product[];
  saleDetailMap: Map<number, number>;
  salesTemporaryInput: SalesTemporary;
  addSalesTemporaryItem: (product: ProductQuantityFunctionProps) => void;
  removeSalesTemporaryItem: (product: ProductQuantityFunctionProps) => void;
}) {
  const { isCollapsed } = useSidebarStore();
  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <div
        className={cn(
          "grid gap-4 pt-4 md:grid-cols-3",
          !isCollapsed ? "xl:grid-cols-2" : "",
        )}
      >
        {products.map((product) => (
          <CardProduct
            saleDetailMap={saleDetailMap}
            key={product.id}
            product={product}
            addSalesTemporaryItem={addSalesTemporaryItem}
            removeSalesTemporaryItem={removeSalesTemporaryItem}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

function TabContentWithDisplayModeTable({
  products,
  saleDetailMap,
  addSalesTemporaryItem,
  removeSalesTemporaryItem,
}: {
  products: Product[];
  saleDetailMap: Map<number, number>;
  addSalesTemporaryItem: (product: ProductQuantityFunctionProps) => void;
  removeSalesTemporaryItem: (product: ProductQuantityFunctionProps) => void;
}) {
  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Produk</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => {
            return (
              <TableRow key={product.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product?.stock_qty ?? "-"}</TableCell>
                <TableCell>
                  {formatNumberToCurrency(Number(product.price))}
                </TableCell>
                <TableCell>
                  <QuantityButtonGroup
                    product={product}
                    saleDetailMap={saleDetailMap}
                    addSalesTemporaryItem={addSalesTemporaryItem}
                    removeSalesTemporaryItem={removeSalesTemporaryItem}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
