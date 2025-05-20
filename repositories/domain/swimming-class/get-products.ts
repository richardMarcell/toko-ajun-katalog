import { db } from "@/db";
import { products, stocks } from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { Product } from "@/types/domains/swimming-class/general";
import { eq } from "drizzle-orm";

export async function getProducts(): Promise<{
  products: Product[];
}> {
  const warehouseId = SateliteUnitConfig.swimming_class.warehouse_id;
  const productList = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      swimming_class_valid_for: products.swimming_class_valid_for,
    })
    .from(products)
    .leftJoin(stocks, eq(stocks.product_id, products.id))
    .where(eq(stocks.warehouse_id, warehouseId));

  return {
    products: productList,
  };
}
