import { db } from "@/db";
import { products, stocks } from "@/db/schema";
import { productCategories } from "@/db/schema/product-categories";
import { ProductConfig } from "@/lib/config/product-config";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { and, eq, not, sql } from "drizzle-orm";

export async function getProductCategories() {
  const warehouseId = SateliteUnitConfig.dimsum.warehouse_id;

  const productCategoryList = await db
    .select({
      id: productCategories.id,
      name: productCategories.name,
      total_products: sql<number>`COUNT(${products.id})`.as("total_products"),
    })
    .from(productCategories)
    .leftJoin(products, eq(productCategories.id, products.product_category_id))
    .leftJoin(stocks, eq(stocks.product_id, products.id))
    .where(
      and(
        eq(stocks.warehouse_id, warehouseId),
        not(eq(products.id, ProductConfig.special_item.id)),
      ),
    )
    .groupBy(productCategories.id);

  return {
    productCategories: productCategoryList,
  };
}
