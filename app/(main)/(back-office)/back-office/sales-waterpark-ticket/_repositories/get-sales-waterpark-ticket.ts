import { db } from "@/db";
import { sales, salesDetails } from "@/db/schema";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { getAllTicketProductIds } from "@/lib/services/ticket/get-ticket-product-ids";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { PaginatedResponse } from "@/types/paginated-response";
import { Payment } from "@/types/payment";
import { Sale } from "@/types/sale";
import { SaleDetail } from "@/types/sale-detail";
import { SaleTicket } from "@/types/sale-ticket";
import { and, count, eq, inArray, sql } from "drizzle-orm";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export type SaleIncludeRelationship = Sale & {
  salesDetails: SaleDetail[];
  salesTicket: SaleTicket | null;
  payments: Payment[];
};

export async function getSalesWaterparkTicket({
  searchParams,
}: {
  searchParams: BackOfficeSearchParams<{
    keyword: string;
    date: string;
  }>;
}): Promise<PaginatedResponse<{ sales: SaleIncludeRelationship[] }>> {
  const currentPageSize = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const currentPage = Number(searchParams.page ?? DEFAULT_PAGE);
  const offset = (currentPage - 1) * currentPageSize;
  const limit = currentPageSize;

  // const keyword = searchParams.keyword ? searchParams.keyword : "";
  const date = searchParams.date ? searchParams.date : "";

  if (!date) {
    return {
      currentPageSize,
      currentPage,
      offset,
      lastPage: 0,
      sales: [],
    };
  }

  const totalSalesList = await db
    .select({
      count: count(),
    })
    .from(sales)
    .where(
      and(
        eq(sales.transaction_type, SalesTransactionTypeEnum.TICKET_SALE),
        sql`DATE(${sales.created_at}) = ${date}`,
      ),
    );
  const totalData = totalSalesList[0].count;

  const lastPage = Math.ceil(totalData / currentPageSize);
  const salesList = await db.query.sales.findMany({
    with: {
      salesDetails: {
        where: inArray(salesDetails.product_id, getAllTicketProductIds()),
      },
      salesTicket: true,
      payments: true,
    },
    where: and(
      eq(sales.transaction_type, SalesTransactionTypeEnum.TICKET_SALE),
      sql`DATE(${sales.created_at}) = ${date}`,
    ),
    orderBy: (sales, { desc }) => desc(sales.created_at),
    offset: offset,
    limit: limit,
  });

  return {
    currentPageSize,
    currentPage,
    offset,
    lastPage,
    sales: salesList,
  };
}
