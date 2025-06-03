import { db } from "@/db";
import { sales as salesSchema } from "@/db/schema";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { User } from "@/types/next-auth";
import { PaginatedResponse } from "@/types/paginated-response";
import { and, count, eq } from "drizzle-orm";
import { SaleIncluRelationship } from "./get-sale";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export async function getSales({
  searchParams,
  user,
}: {
  searchParams: BackOfficeSearchParams;
  user: User;
}): Promise<PaginatedResponse<{ sales: SaleIncluRelationship[] }>> {
  const currentPageSize = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const currentPage = Number(searchParams.page ?? DEFAULT_PAGE);
  const offset = (currentPage - 1) * currentPageSize;
  const limit = currentPageSize;

  const totalSales = await db
    .select({
      count: count(),
    })
    .from(salesSchema)
    .where(and(eq(salesSchema.created_by, BigInt(user.id))));
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
    where: and(eq(salesSchema.created_by, BigInt(user.id))),
  });

  return {
    currentPageSize,
    currentPage,
    offset,
    lastPage,
    sales,
  };
}
