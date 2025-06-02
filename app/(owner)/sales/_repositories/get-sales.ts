import { db } from "@/db";
import { sales as salesSchema } from "@/db/schema";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { PaginatedResponse } from "@/types/paginated-response";
import { and, count, eq, sql } from "drizzle-orm";
import { SaleIncluRelationship } from "./get-sale";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export async function getSales({
  searchParams,
}: {
  searchParams: BackOfficeSearchParams<{
    startDate: string;
    endDate: string;
    status: string;
  }>;
}): Promise<PaginatedResponse<{ sales: SaleIncluRelationship[] }>> {
  const currentPageSize = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const currentPage = Number(searchParams.page ?? DEFAULT_PAGE);
  const offset = (currentPage - 1) * currentPageSize;
  const limit = currentPageSize;

  const startDate = searchParams.startDate ? searchParams.startDate : "";
  const endDate = searchParams.endDate ? searchParams.endDate : "";
  const status = searchParams.status ? searchParams.status : "";

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
        status ? eq(salesSchema.status, status) : undefined,
      ),
    );
  const totalData = totalSales[0].count;

  const lastPage = Math.ceil(totalData / currentPageSize);
  const sales = await db.query.sales.findMany({
    with: {
      salesDetails: {
        with: {
          product: true,
        },
      },
      user: true,
    },
    orderBy: (sales, { desc }) => desc(sales.created_at),
    offset: offset,
    limit: limit,
    where: and(
      and(
        sql`DATE(${salesSchema.created_at}) >= ${startDate}`,
        sql`DATE(${salesSchema.created_at}) <= ${endDate}`,
        status ? eq(salesSchema.status, status) : undefined,
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
