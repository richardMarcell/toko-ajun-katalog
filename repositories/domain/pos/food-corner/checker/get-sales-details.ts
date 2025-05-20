import { db } from "@/db";
import {
  products,
  sales,
  salesDetails,
  salesFoodCorner,
  tenants,
} from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { OrderStatusEnum } from "@/lib/enums/OrderStatusEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import getClientIp from "@/lib/services/auth/get-client-ip";
import { can } from "@/lib/services/permissions/can";
import { SalesDetail } from "@/types/domains/pos/food-corner/checker/list";
import { User } from "@/types/next-auth";
import { and, eq } from "drizzle-orm";

export async function getSalesDetails({
  user,
  searchParams,
}: {
  user: User;
  searchParams: { tenantId: number | undefined };
}): Promise<{ salesDetails: SalesDetail[] }> {
  const isCanShowAllChecker = await can({
    permissionNames: [PermissionEnum.FOOD_CORNER_SALES_CHECKER_SHOW_ALL],
    user: user,
    isRedirectToForbiddenPage: false,
  });

  const whereClause = [];

  whereClause.push(
    eq(salesDetails.order_status, OrderStatusEnum.PREPARING),
    eq(sales.unit_business, SateliteUnitConfig.food_corner.unit_business),
    eq(sales.transaction_type, SalesTransactionTypeEnum.FOOD_CORNER_SALE),
  );

  if (isCanShowAllChecker) {
    const tenantId = searchParams.tenantId;

    if (tenantId) {
      whereClause.push(eq(products.fc_tenant_id, BigInt(tenantId)));
    }
  } else {
    const clientIp = await getClientIp();

    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.ip_address, clientIp),
    });

    if (!tenant)
      return {
        salesDetails: [],
      };
    whereClause.push(eq(products.fc_tenant_id, BigInt(tenant.id)));
  }

  const salesDetailsData = await db
    .select({
      id: salesDetails.id,
      note: salesDetails.note,
      qty: salesDetails.qty,
      created_at: salesDetails.created_at,
      order_number: salesFoodCorner.order_number,
      order_status: salesDetails.order_status,
      product_name: products.name,
      table_number: salesFoodCorner.table_number,
      type_order: salesFoodCorner.order_type,
    })
    .from(salesDetails)
    .where(and(...whereClause))
    .leftJoin(sales, eq(salesDetails.sales_id, sales.id))
    .leftJoin(salesFoodCorner, eq(sales.id, salesFoodCorner.sales_id))
    .leftJoin(products, eq(salesDetails.product_id, products.id));

  return {
    salesDetails: salesDetailsData,
  };
}
