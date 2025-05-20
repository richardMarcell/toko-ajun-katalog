import { db } from "@/db";
import { ipLocations as ipLocationSchema } from "@/db/schema";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { PaginatedResponse } from "@/types/paginated-response";
import { count } from "drizzle-orm";
import { IpLocationIncludeRelationship } from "./get-ip-location";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export async function getIpLocations({
  searchParams,
}: {
  searchParams: BackOfficeSearchParams;
}): Promise<
  PaginatedResponse<{ ipLocations: IpLocationIncludeRelationship[] }>
> {
  const currentPageSize = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const currentPage = Number(searchParams.page ?? DEFAULT_PAGE);
  const offset = (currentPage - 1) * currentPageSize;
  const limit = currentPageSize;

  const totalIpLocations = await db
    .select({ count: count() })
    .from(ipLocationSchema);
  const totalData = totalIpLocations[0].count;

  const lastPage = Math.ceil(totalData / currentPageSize);
  const ipLocations = await db.query.ipLocations.findMany({
    with: {
      currentLoggedInUser: true,
    },
    offset: offset,
    limit: limit,
  });

  return {
    currentPageSize,
    currentPage,
    offset,
    lastPage,
    ipLocations,
  };
}
