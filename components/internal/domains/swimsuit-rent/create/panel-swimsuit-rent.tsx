"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SwimsuitRentProvider } from "@/contexts/swimsuit-rent-context";
import { Product } from "@/types/domains/swimsuit-rent/general";
import { Wallet } from "@/types/wallet";
import { PanelSwimsuitRentSummary } from "./panel-swimsuit-rent-summary";
import { ProductListOrder } from "./product-list-order";
import { SwitchToggleProductListDisplay } from "./switch-toggle-product-list-display";

export function PanelSwimsuitRent({
  products,
  totalProducts,
  wallet,
}: {
  products: Product[];
  totalProducts: number;
  wallet: Wallet | null;
}) {
  return (
    <SwimsuitRentProvider>
      <Card className="w-full px-4 py-5">
        <CardContent className="flex gap-4 p-2">
          <div className="w-[75%]">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl">All Items ({totalProducts})</h1>
              <SwitchToggleProductListDisplay />
            </div>
            <ProductListOrder products={products} />
          </div>

          <PanelSwimsuitRentSummary wallet={wallet} />
        </CardContent>
      </Card>
    </SwimsuitRentProvider>
  );
}
