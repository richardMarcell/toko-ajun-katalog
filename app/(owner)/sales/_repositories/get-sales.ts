import { db } from "@/db";
import { sales as salesSchema } from "@/db/schema";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { PaginatedResponse } from "@/types/paginated-response";
import { Sale } from "@/types/sale";
import { and, count, eq, sql } from "drizzle-orm";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1; 

export async function getSales({
  searchParams,
}: {
  searchParams: BackOfficeSearchParams<{
    startDate: string;
    endDate: string;
    userId: string;
  }>;
}): Promise<PaginatedResponse<{ sales: Sale[] }>> {
  const currentPageSize = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const currentPage = Number(searchParams.page ?? DEFAULT_PAGE);
  const offset = (currentPage - 1) * currentPageSize;
  const limit = currentPageSize;

  const startDate = searchParams.startDate ? searchParams.startDate : "";
  const endDate = searchParams.endDate ? searchParams.endDate : "";
  const userId = searchParams.userId ? searchParams.userId : "";

  if (!startDate && !endDate) {
    return {
      currentPageSize,
      currentPage,
      offset,
      lastPage: 0,
      sales: [],
    };
  }

  const totalSales = await db
    .select({
      count: count(),
    })
    .from(salesSchema)
    .where(
      and(
        sql`DATE(${salesSchema.created_at}) >= ${startDate}`,
        sql`DATE(${salesSchema.created_at}) <= ${endDate}`,
        userId ? eq(salesSchema.created_by, BigInt(userId)) : undefined,
      ),
    );
  const totalData = totalSales[0].count;

  const lastPage = Math.ceil(totalData / currentPageSize);
  const sales = await db.query.sales.findMany({
    orderBy: (sales, { desc }) => desc(sales.created_at),
    offset: offset,
    limit: limit,
    where: and(
      and(
        sql`DATE(${salesSchema.created_at}) >= ${startDate}`,
        sql`DATE(${salesSchema.created_at}) <= ${endDate}`,
        userId ? eq(salesSchema.created_by, BigInt(userId)) : undefined,
      ),
    ),
  });

  return {
    currentPageSize,
    currentPage,
    offset,
    lastPage,
    sales,
  };
}
