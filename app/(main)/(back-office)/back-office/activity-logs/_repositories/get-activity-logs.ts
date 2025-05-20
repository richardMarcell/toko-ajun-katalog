import { db } from "@/db";
import { activityLogs } from "@/db/schema";
import { ActivityLog } from "@/types/activity-logs";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { PaginatedResponse } from "@/types/paginated-response";
import { User } from "@/types/user";
import { count } from "drizzle-orm";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export type ActivityLogIncludeRelationship = ActivityLog & {
  user: User | null;
};

export default async function getActivityLogs({
  searchParams,
}: {
  searchParams: BackOfficeSearchParams<{
    keyword: string;
    date: string;
  }>;
}): Promise<
  PaginatedResponse<{ activityLogs: ActivityLogIncludeRelationship[] }>
> {
  const currentPageSize = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const currentPage = Number(searchParams.page ?? DEFAULT_PAGE);
  const offset = (currentPage - 1) * currentPageSize;
  const limit = currentPageSize;

  const totalActivityLogsList = await db
    .select({
      count: count(),
    })
    .from(activityLogs);
  const totalData = totalActivityLogsList[0].count;

  const lastPage = Math.ceil(totalData / currentPageSize);
  const activityLogsList = await db.query.activityLogs.findMany({
    with: {
      user: true,
    },
    orderBy: (activityLogs, { desc }) => desc(activityLogs.created_at),
    offset: offset,
    limit: limit,
  });

  return {
    currentPageSize,
    currentPage,
    offset,
    lastPage,
    activityLogs: activityLogsList,
  };
}
