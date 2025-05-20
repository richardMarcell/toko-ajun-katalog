"use client";

import { ProductWithStock } from "@/app/(main)/pos/resto/_repositories/get-products";
import { Card, CardContent } from "@/components/ui/card";
import { CaptainOrderIncludeRelationship } from "../_types/edit";
import { MenuListOrder } from "./menu-list-order";
import { PanelOrderSummary } from "./panel-order-summary";
import { SwitchToggleMenuListDisplay } from "./switch-toggle-menu-list-display";

export function PanelOrderMenu({
  products,
  totalProducts,
  captainOrder,
}: {
  products: ProductWithStock[];
  totalProducts: number;
  captainOrder: CaptainOrderIncludeRelationship;
}) {
  return (
    <Card className="w-4/5 px-4 py-5">
      <CardContent className="space-y-4 p-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">All Items ({totalProducts})</h1>
          <SwitchToggleMenuListDisplay />
        </div>

        <div className="flex gap-4">
          <MenuListOrder captainOrder={captainOrder} products={products} />
          <PanelOrderSummary captainOrder={captainOrder} />
        </div>
      </CardContent>
    </Card>
  );
}
