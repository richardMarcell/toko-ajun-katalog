import { db } from "@/db";
import { products, stocks, tenants } from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { and, eq, sql } from "drizzle-orm";

export async function getProducts({ tenantId }: { tenantId: string }) {
  const warehouseId = SateliteUnitConfig.food_corner.warehouse_id;
  const productList = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      image: products.image,
      description: products.description,
      tenant: tenants.name,
      stock_qty: stocks.qty,
    })
    .from(products)
    .leftJoin(tenants, eq(products.fc_tenant_id, tenants.id))
    .leftJoin(stocks, eq(stocks.product_id, products.id))
    .where(
      and(
        tenantId ? eq(products.fc_tenant_id, BigInt(tenantId)) : undefined,
        eq(stocks.warehouse_id, warehouseId),
      ),
    );

  const totalProducts = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(products)
    .leftJoin(tenants, eq(products.fc_tenant_id, tenants.id))
    .leftJoin(stocks, eq(stocks.product_id, products.id))
    .where(
      and(
        tenantId ? eq(products.fc_tenant_id, BigInt(tenantId)) : undefined,
        eq(stocks.warehouse_id, warehouseId),
      ),
    );

  return {
    products: productList,
    totalProducts: totalProducts[0].count,
  };
}
