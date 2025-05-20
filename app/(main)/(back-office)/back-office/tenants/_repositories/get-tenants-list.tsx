import { db } from "@/db";
import { tenants } from "@/db/schema";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { PaginatedResponse } from "@/types/paginated-response";
import { Tenant } from "@/types/tenant";
import { and, count, like } from "drizzle-orm";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export async function getTenantsLists({
  searchParams,
}: {
  searchParams: BackOfficeSearchParams<{
    keyword: string;
  }>;
}): Promise<
  PaginatedResponse<{
    tenantsList: Pick<
      Tenant,
      "id" | "name" | "ip_address" | "image" | "is_required_tax"
    >[];
  }>
> {
  const currentPageSize = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const currentPage = Number(searchParams.page ?? DEFAULT_PAGE);
  const offset = (currentPage - 1) * currentPageSize;
  const limit = currentPageSize;

  const keyword = searchParams.keyword ? searchParams.keyword : "";

  const whereClause = [];

  if (keyword) {
    whereClause.push(like(tenants.name, `%${keyword}%`));
  }

  const totalTenants = await db
    .select({ count: count() })
    .from(tenants)
    .where(whereClause.length > 0 ? and(...whereClause) : undefined);
  const totalData = totalTenants[0].count;

  const lastPage = Math.ceil(totalData / currentPageSize);
  const tenantsList = await db.query.tenants.findMany({
    columns: {
      id: true,
      name: true,
      ip_address: true,
      image: true,
      is_required_tax: true,
    },
    where: whereClause.length > 0 ? and(...whereClause) : undefined,
    offset: offset,
    limit: limit,
  });

  return {
    currentPageSize,
    currentPage,
    offset,
    lastPage,
    tenantsList,
  };
}
