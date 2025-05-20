import { db } from "@/db";
import { sales } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { can } from "@/lib/services/permissions/can";
import { formaterDate, getCurrentDate } from "@/lib/utils";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { User } from "@/types/next-auth";
import { PaginatedResponse } from "@/types/paginated-response";
import { Payment } from "@/types/payment";
import { Sale } from "@/types/sale";
import { and, count, eq, inArray, like, or, sql } from "drizzle-orm";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

type SaleIncludePayment = Sale & {
  payments: Payment[];
};

export default async function getSalesList({
  searchParams,
  user,
}: {
  searchParams: BackOfficeSearchParams<{
    keyword: string;
    date: string;
    businessUnits: string[];
    transactionTypes: string[];
  }>;
  user: User;
}): Promise<PaginatedResponse<{ salesList: SaleIncludePayment[] }>> {
  const currentPageSize = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const currentPage = Number(searchParams.page ?? DEFAULT_PAGE);
  const offset = (currentPage - 1) * currentPageSize;
  const limit = currentPageSize;

  const currentDate = formaterDate(getCurrentDate(), "shortDate");
  const userHavePermissionIndexAll = await can({
    permissionNames: [PermissionEnum.SALES_INDEX_ALL],
    user: user,
    isRedirectToForbiddenPage: false,
  });

  const keyword = searchParams.keyword ? searchParams.keyword : "";
  const businessUnits = searchParams.businessUnits
    ? searchParams.businessUnits
    : [];
  const transactionTypes = searchParams.transactionTypes
    ? searchParams.transactionTypes
    : [];

  const whereClause = [];

  if (!userHavePermissionIndexAll) {
    whereClause.push(eq(sales.created_by, BigInt(user.id)));
  }

  if (keyword) {
    whereClause.push(or(like(sales.code, `%${keyword}%`)));
  }

  if (businessUnits.length > 0) {
    whereClause.push(inArray(sales.unit_business, businessUnits));
  }

  if (transactionTypes.length > 0) {
    whereClause.push(inArray(sales.transaction_type, transactionTypes));
  }

  const totalSales = await db
    .select({ count: count() })
    .from(sales)
    .where(
      and(
        ...whereClause,
        eq(sql`DATE(${sales.created_at})`, searchParams.date ?? currentDate),
      ),
    );
  const totalData = totalSales[0].count;

  const lastPage = Math.ceil(totalData / currentPageSize);
  const salesList = await db.query.sales.findMany({
    where: and(
      ...whereClause,
      eq(sql`DATE(${sales.created_at})`, searchParams.date ?? currentDate),
    ),
    with: {
      payments: true,
    },
    orderBy: (sales, { desc }) => desc(sales.created_at),
    offset: offset,
    limit: limit,
  });

  return {
    currentPageSize,
    currentPage,
    offset,
    lastPage,
    salesList,
  };
}
