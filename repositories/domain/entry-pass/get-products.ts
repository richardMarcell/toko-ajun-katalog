import { db } from "@/db";
import { products, stocks } from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { Product } from "@/types/domains/entry-pass/general";
import { eq } from "drizzle-orm";

export async function getProducts(): Promise<{
  products: Product[];
}> {
  const warehouseId = SateliteUnitConfig.entry_pass.warehouse_id;
  const productList = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      ep_valid_term: products.ep_valid_term,
    })
    .from(products)
    .leftJoin(stocks, eq(stocks.product_id, products.id))
    .where(eq(stocks.warehouse_id, warehouseId));

  return {
    products: productList,
  };
}
