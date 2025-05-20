import { db } from "@/db";
import {
  products,
  sales,
  salesDetails,
  salesFoodCorner,
  tenants,
} from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import getClientIp from "@/lib/services/auth/get-client-ip";
import { can } from "@/lib/services/permissions/can";
import { User } from "@/types/next-auth";
import { PaginatedResponse } from "@/types/paginated-response";
import { and, count, desc, eq } from "drizzle-orm";
import { SalesDetail } from "@/types/domains/pos/food-corner/checker/list";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export async function getSalesDetails({
  user,
  searchParams,
}: {
  user: User;
  searchParams: {
    pageSize: string;
    page: string;
    tenantId: number | undefined;
  };
}): Promise<PaginatedResponse<{ salesDetails: SalesDetail[] }>> {
  const currentPageSize = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const currentPage = Number(searchParams.page ?? DEFAULT_PAGE);
  const offset = (currentPage - 1) * currentPageSize;
  const limit = currentPageSize;

  const isCanShowAllChecker = await can({
    permissionNames: [
      PermissionEnum.FOOD_CORNER_SALES_CHECKER_HISTORY_SHOW_ALL,
    ],
    user: user,
    isRedirectToForbiddenPage: false,
  });

  const whereClause = [];

  whereClause.push(
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
        currentPageSize,
        currentPage,
        offset,
        lastPage: 0,
        salesDetails: [],
      };

    whereClause.push(eq(products.fc_tenant_id, BigInt(tenant.id)));
  }

  const totalActivityLogsList = await db
    .select({
      count: count(),
    })
    .from(salesDetails)
    .where(and(...whereClause))
    .leftJoin(sales, eq(salesDetails.sales_id, sales.id))
    .leftJoin(salesFoodCorner, eq(sales.id, salesFoodCorner.sales_id))
    .leftJoin(products, eq(salesDetails.product_id, products.id));
  const totalData = totalActivityLogsList[0].count;

  const lastPage = Math.ceil(totalData / currentPageSize);

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
    .leftJoin(products, eq(salesDetails.product_id, products.id))
    .orderBy(desc(salesDetails.created_at))
    .limit(limit)
    .offset(offset);

  return {
    currentPageSize,
    currentPage,
    offset,
    lastPage,
    salesDetails: salesDetailsData,
  };
}
