import { db } from "@/db";
import { products, stocks } from "@/db/schema";
import { ProductConfig } from "@/lib/config/product-config";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { and, eq, inArray, not, sql } from "drizzle-orm";

export async function getProducts() {
  const warehouseId = SateliteUnitConfig.locker.warehouse_id;
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
    .where(
      and(
        eq(stocks.warehouse_id, warehouseId),
        eq(products.is_rentable, false),
        not(
          inArray(products.id, [
            ProductConfig.wristband.id,
            ProductConfig.top_up.id,
          ]),
        ),
      ),
    );

  const totalProducts = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(products)
    .leftJoin(stocks, eq(stocks.product_id, products.id))
    .where(
      and(
        eq(stocks.warehouse_id, warehouseId),
        eq(products.is_rentable, false),
        not(
          inArray(products.id, [
            ProductConfig.wristband.id,
            ProductConfig.top_up.id,
          ]),
        ),
      ),
    );

  return {
    products: productList,
    totalProducts: totalProducts[0].count,
  };
}
