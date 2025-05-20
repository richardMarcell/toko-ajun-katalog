import { db } from "@/db";
import { products, stocks } from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { eq, sql } from "drizzle-orm";

export async function getProducts() {
  const warehouseId = SateliteUnitConfig.souvenir.warehouse_id;

  const productList = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      image: products.image,
      description: products.description,
      stock_qty: stocks.qty,
    })
    .from(products)
    .leftJoin(stocks, eq(stocks.product_id, products.id))
    .where(eq(stocks.warehouse_id, warehouseId));

  const totalProducts = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(products)
    .leftJoin(stocks, eq(stocks.product_id, products.id))
    .where(eq(stocks.warehouse_id, warehouseId));

  return {
    products: productList,
    totalProducts: totalProducts[0].count,
  };
}
