"use client";

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

import { ProductWithStock } from "@/app/(main)/pos/resto/_repositories/get-products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CaptainOrderIncludeRelationship } from "../_types/edit";
import { DialogFormOrderProduct } from "./dialog-form-order-product";

export function MenuListOrder({
  products,
  captainOrder,
}: {
  products: ProductWithStock[];
  captainOrder: CaptainOrderIncludeRelationship;
}) {
  const searchParams = useSearchParams();
  const displayMode = searchParams.get("displayMode") || "CARD";

  if (displayMode === "TABLE")
    return (
      <MenuListWithDisplayModeTable
        captainOrder={captainOrder}
        products={products}
      />
    );
  else
    return (
      <MenuListWithDisplayModeCard
        captainOrder={captainOrder}
        products={products}
      />
    );
}

function MenuListWithDisplayModeCard({
  products,
  captainOrder,
}: {
  products: ProductWithStock[];
  captainOrder: CaptainOrderIncludeRelationship;
}) {
  const { isCollapsed } = useSidebarStore();
  return (
    <ScrollArea className="h-[calc(100vh-220px)] w-[65%]">
      <div
        className={cn(
          "grid gap-4 md:grid-cols-2",
          !isCollapsed ? "xl:grid-cols-1" : "",
        )}
      >
        {products.map((product) => {
          const orderedProduct = captainOrder.captainOrderDetails.find(
            (detail) => detail.product_id == product.id,
          );
          return (
            <DialogFormOrderProduct
              orderedProduct={orderedProduct}
              product={product}
              key={product.id}
              disabled={captainOrder.is_closed}
            >
              <div>
                <CardProduct product={product} />
              </div>
            </DialogFormOrderProduct>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function MenuListWithDisplayModeTable({
  products,
  captainOrder,
}: {
  products: ProductWithStock[];
  captainOrder: CaptainOrderIncludeRelationship;
}) {
  return (
    <ScrollArea className="h-[calc(100vh-220px)] w-[65%]">
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
            const orderedProduct = captainOrder.captainOrderDetails.find(
              (detail) => detail.product_id == product.id,
            );
            return (
              <TableRow key={product.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product?.stock_qty ?? "-"}</TableCell>
                <TableCell>
                  {formatNumberToCurrency(Number(product.price))}
                </TableCell>
                <TableCell>
                  <DialogFormOrderProduct
                    orderedProduct={orderedProduct}
                    product={product}
                    disabled={captainOrder.is_closed}
                  >
                    <Button type="button" className="bg-qubu_blue">
                      Pesan
                    </Button>
                  </DialogFormOrderProduct>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

export function CardProduct({ product }: { product: ProductWithStock }) {
  return (
    <Card className="cursor-pointer p-3">
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
            {product.stock_qty && (
              <div>
                <p className="w-fit rounded-full py-1 text-sm font-semibold">{`Stok tersedia: ${product.stock_qty}`}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <span className="font-medium">
            {formatNumberToCurrency(Number(product.price))}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
