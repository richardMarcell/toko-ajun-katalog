import { db } from "@/db";
import { products, stocks } from "@/db/schema";
import { ProductConfig } from "@/lib/config/product-config";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { and, eq, not, sql } from "drizzle-orm";

export type ProductWithStock = {
  id: bigint;
  name: string;
  price: string;
  image: string;
  description: string;
  stock_qty?: number | null;
};

export async function getProducts({
  productCategoryId,
}: {
  productCategoryId: string;
}): Promise<{
  products: ProductWithStock[];
  totalProducts: number;
}> {
  const warehouseId = SateliteUnitConfig.dimsum.warehouse_id;
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
        not(eq(products.id, ProductConfig.special_item.id)),
        productCategoryId
          ? eq(products.product_category_id, BigInt(productCategoryId))
          : undefined,
      ),
    );

  const totalProducts = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(products)
    .leftJoin(stocks, eq(stocks.product_id, products.id))
    .where(
      and(
        eq(stocks.warehouse_id, warehouseId),
        not(eq(products.id, ProductConfig.special_item.id)),
        productCategoryId
          ? eq(products.product_category_id, BigInt(productCategoryId))
          : undefined,
      ),
    );

  return {
    products: productList,
    totalProducts: totalProducts[0].count,
  };
}
