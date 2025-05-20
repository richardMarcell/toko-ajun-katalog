"use client";

import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";
import { SaleWithRelationsMapped } from "@/types/domains/pos/food-corner/sales/list";
import CardSales from "./card-sales";

export default function BoardSales({
  sales,
}: {
  sales: SaleWithRelationsMapped[];
}) {
  const { isCollapsed } = useSidebarStore();
  return (
    <div
      className={cn(
        "grid gap-4 pt-4",
        isCollapsed
          ? "lg:grid-cols-2 xl:grid-cols-3"
          : "grid-cols-1 xl:grid-cols-2",
      )}
    >
      {sales.map((sale) => (
        <CardSales key={sale.id} sale={sale} />
      ))}
    </div>
  );
}
