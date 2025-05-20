import { db } from "@/db";
import { tenants } from "@/db/schema";
import { Tenant } from "@/types/tenant";
import { eq } from "drizzle-orm";

export async function getTenant({
  tenantId,
}: {
  tenantId: string;
}): Promise<{ tenant: Tenant | null }> {
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, BigInt(tenantId)),
  });

  if (!tenant)
    return {
      tenant: null,
    };

  return {
    tenant,
  };
}
