import { db } from "@/db";
import { users as userSchema } from "@/db/schema";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { PaginatedResponse } from "@/types/paginated-response";
import { User } from "@/types/user";
import { UserHasRole } from "@/types/user-has-role";
import { count, like, or } from "drizzle-orm";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export type UserIncludeRelationship = User & {
  userHasRoles: UserHasRole[];
};

export async function getUsers({
  searchParams,
}: {
  searchParams: BackOfficeSearchParams<{
    keyword: string;
  }>;
}): Promise<PaginatedResponse<{ users: UserIncludeRelationship[] }>> {
  const currentPageSize = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const currentPage = Number(searchParams.page ?? DEFAULT_PAGE);
  const offset = (currentPage - 1) * currentPageSize;
  const limit = currentPageSize;

  const keyword = searchParams.keyword ? searchParams.keyword : "";

  const totalUsers = await db
    .select({
      count: count(),
    })
    .from(userSchema)
    .where(
      or(
        like(userSchema.name, `%${keyword}%`),
        // like(userSchema.email, `%${keyword}%`),
      ),
    );
  const totalData = totalUsers[0].count;

  const lastPage = Math.ceil(totalData / currentPageSize);
  const users = await db.query.users.findMany({
    with: {
      userHasRoles: true,
    },
    where: or(
      like(userSchema.name, `%${keyword}%`),
      // like(userSchema.email, `%${keyword}%`),
    ),
    orderBy: (users, { asc }) => asc(users.id),
    offset: offset,
    limit: limit,
  });

  return {
    currentPageSize,
    currentPage,
    offset,
    lastPage,
    users,
  };
}
