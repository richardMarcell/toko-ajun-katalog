import { db } from "@/db";
import { promos as promoSchema } from "@/db/schema";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { PaginatedResponse } from "@/types/paginated-response";
import { Promo } from "@/types/promo";
import { and, count, inArray, like } from "drizzle-orm";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export async function getPromos({
  searchParams,
}: {
  searchParams: BackOfficeSearchParams<{
    keyword: string;
    types: string;
  }>;
}): Promise<PaginatedResponse<{ promos: Promo[] }>> {
  const currentPageSize = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const currentPage = Number(searchParams.page ?? DEFAULT_PAGE);
  const offset = (currentPage - 1) * currentPageSize;
  const limit = currentPageSize;

  const keyword = searchParams.keyword ? searchParams.keyword : "";
  const types = searchParams.types ? searchParams.types.split(",") : [];

  const whereClause = [];

  if (keyword) {
    whereClause.push(like(promoSchema.code, `%${keyword}%`));
  }

  if (types.length > 0) {
    whereClause.push(inArray(promoSchema.type, types));
  }

  const totalPromos = await db
    .select({ count: count() })
    .from(promoSchema)
    .where(whereClause.length > 0 ? and(...whereClause) : undefined);
  const totalData = totalPromos[0].count;

  const lastPage = Math.ceil(totalData / currentPageSize);
  const promos = await db.query.promos.findMany({
    where: whereClause.length > 0 ? and(...whereClause) : undefined,
    offset: offset,
    limit: limit,
  });

  return {
    currentPageSize,
    currentPage,
    offset,
    lastPage,
    promos,
  };
}
