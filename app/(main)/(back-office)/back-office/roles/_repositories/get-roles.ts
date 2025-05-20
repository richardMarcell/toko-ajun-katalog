import { db } from "@/db";
import { roles } from "@/db/schema";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { PaginatedResponse } from "@/types/paginated-response";
import { Role } from "@/types/role";
import { count, like, or } from "drizzle-orm";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export default async function getRoles({
  searchParams,
}: {
  searchParams: BackOfficeSearchParams<{
    keyword: string;
  }>;
}): Promise<PaginatedResponse<{ rolesList: Role[] }>> {
  const currentPageSize = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const currentPage = Number(searchParams.page ?? DEFAULT_PAGE);
  const offset = (currentPage - 1) * currentPageSize;
  const limit = currentPageSize;

  const keyword = searchParams.keyword ? searchParams.keyword : "";

  const totalRole = await db
    .select({
      count: count(),
    })
    .from(roles)
    .where(or(like(roles.name, `%${keyword}%`)));
  const totalData = totalRole[0].count;

  const lastPage = Math.ceil(totalData / currentPageSize);
  const rolesList = await db.query.roles.findMany({
    where: or(like(roles.name, `%${keyword}%`)),
    orderBy: (roles, { asc }) => asc(roles.id),
    offset: offset,
    limit: limit,
  });

  return {
    currentPageSize,
    currentPage,
    offset,
    lastPage,
    rolesList,
  };
}
