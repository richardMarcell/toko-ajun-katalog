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
import { Product } from "@/types/domains/swimsuit-rent/general";
import { useSearchParams } from "next/navigation";
import { CardProduct } from "./card-product";
import { QuantityButtonGroup } from "./quantity-button-group";

export function ProductListOrder({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const displayMode = searchParams.get("displayMode") || "CARD";

  if (displayMode === "TABLE")
    return <ProductListWithDisplayModeTable products={products} />;

  if (displayMode === "CARD")
    return <ProductListWithDisplayModeCard products={products} />;
}

function ProductListWithDisplayModeCard({ products }: { products: Product[] }) {
  const { isCollapsed } = useSidebarStore();
  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <div
        className={cn(
          "grid gap-4 pt-4 md:grid-cols-3",
          !isCollapsed ? "xl:grid-cols-2" : "",
        )}
      >
        {products.map((product) => {
          return <CardProduct key={product.id} product={product} />;
        })}
      </div>
    </ScrollArea>
  );
}

function ProductListWithDisplayModeTable({
  products,
}: {
  products: Product[];
}) {
  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Kode Barang</TableHead>
            <TableHead>Produk</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => {
            return (
              <TableRow key={product.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.code}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell className="text-center">
                  {product.stock_qty}
                </TableCell>
                <TableCell>
                  {formatNumberToCurrency(Number(product.price))}
                </TableCell>
                <TableCell>
                  <QuantityButtonGroup product={product} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
