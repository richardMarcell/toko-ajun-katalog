import { db } from "@/db";
import { wristbands as wristbandSchema } from "@/db/schema";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { PaginatedResponse } from "@/types/paginated-response";
import { Wristband } from "@/types/wristband";
import { and, count, inArray, like } from "drizzle-orm";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export async function getWristbands({
  searchParams,
}: {
  searchParams: BackOfficeSearchParams<{
    keyword: string;
    status: string;
  }>;
}): Promise<PaginatedResponse<{ wristbands: Wristband[] }>> {
  const currentPageSize = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const currentPage = Number(searchParams.page ?? DEFAULT_PAGE);
  const offset = (currentPage - 1) * currentPageSize;
  const limit = currentPageSize;

  const keyword = searchParams.keyword ? searchParams.keyword : "";
  const status = searchParams.status ? searchParams.status.split(",") : [];

  const whereClause = [];

  if (keyword) {
    whereClause.push(like(wristbandSchema.code, `%${keyword}%`));
  }

  if (status.length > 0) {
    whereClause.push(inArray(wristbandSchema.status, status));
  }

  const totalWristbands = await db
    .select({ count: count() })
    .from(wristbandSchema)
    .where(whereClause.length > 0 ? and(...whereClause) : undefined);
  const totalData = totalWristbands[0].count;

  const lastPage = Math.ceil(totalData / currentPageSize);
  const wristbands = await db.query.wristbands.findMany({
    where: whereClause.length > 0 ? and(...whereClause) : undefined,
    offset: offset,
    limit: limit,
  });

  return {
    currentPageSize,
    currentPage,
    offset,
    lastPage,
    wristbands,
  };
}
