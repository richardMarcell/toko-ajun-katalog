import { db } from "@/db";
import { products, tenants } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function getTenants() {
  const tenantList = await db
    .select({
      id: tenants.id,
      name: tenants.name,
      image: tenants.image,
      total_products: sql<number>`COUNT(${products.id})`.as("total_products"),
    })
    .from(tenants)
    .leftJoin(products, eq(tenants.id, products.fc_tenant_id))
    .groupBy(tenants.id);

  return {
    tenants: tenantList,
  };
}
