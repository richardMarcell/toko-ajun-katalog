import { db } from "@/db";
import { products, stocks } from "@/db/schema";
import { stockSwimsuitRent } from "@/db/schema/stock-swimsuit-rent";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { and, eq, sql } from "drizzle-orm";

export async function getProducts() {
  const warehouseId = SateliteUnitConfig.locker.warehouse_id;
  const productList = await db
    .select({
      id: products.id,
      name: products.name,
      code: products.code,
      price: products.price,
      image: products.image,
      description: products.description,
      stock_qty: stockSwimsuitRent.qty,
    })
    .from(products)
    .leftJoin(stocks, eq(stocks.product_id, products.id))
    .leftJoin(stockSwimsuitRent, eq(stockSwimsuitRent.product_id, products.id))
    .where(
      and(eq(stocks.warehouse_id, warehouseId), eq(products.is_rentable, true)),
    );

  const totalProducts = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(products)
    .leftJoin(stocks, eq(stocks.product_id, products.id))
    .where(
      and(eq(stocks.warehouse_id, warehouseId), eq(products.is_rentable, true)),
    );

  return {
    products: productList,
    totalProducts: totalProducts[0].count,
  };
}
