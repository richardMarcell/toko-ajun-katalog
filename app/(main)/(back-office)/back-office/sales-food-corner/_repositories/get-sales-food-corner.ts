import { db } from "@/db";
import { sales } from "@/db/schema";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { PaginatedResponse } from "@/types/paginated-response";
import { Payment } from "@/types/payment";
import { Product } from "@/types/product";
import { Sale } from "@/types/sale";
import { SaleDetail } from "@/types/sale-detail";
import { SalesFoodCorner } from "@/types/sales-food-corner";
import { Tenant } from "@/types/tenant";
import { and, count, eq, sql } from "drizzle-orm";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

type SaleDetailIncludeRelationship = SaleDetail & {
  product: Product & {
    tenant: Tenant | null;
  };
};

export type SaleIncludeRelationship = Sale & {
  salesDetails: SaleDetailIncludeRelationship[];
  salesFoodCorner: SalesFoodCorner | null;
  payments: Payment[];
};

export async function getSalesFoodCorner({
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
        eq(sales.transaction_type, SalesTransactionTypeEnum.FOOD_CORNER_SALE),
        sql`DATE(${sales.created_at}) = ${date}`,
      ),
    );
  const totalData = totalSalesList[0].count;

  const lastPage = Math.ceil(totalData / currentPageSize);
  const salesList = await db.query.sales.findMany({
    with: {
      salesDetails: {
        with: {
          product: { with: { tenant: true } },
        },
      },
      salesFoodCorner: true,
      payments: true,
    },
    where: and(
      eq(sales.transaction_type, SalesTransactionTypeEnum.FOOD_CORNER_SALE),
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
