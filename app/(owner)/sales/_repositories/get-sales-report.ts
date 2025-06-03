import { db } from "@/db";
import { sales as salesSchema } from "@/db/schema";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { and, eq, sql } from "drizzle-orm";
import { SaleIncluRelationship } from "./get-sale";

export async function getSalesReport({
  searchParams,
}: {
  searchParams: BackOfficeSearchParams<{
    startDate: string;
    endDate: string;
    status: string;
  }>;
}): Promise<SaleIncluRelationship[]> {
  const startDate = searchParams.startDate ? searchParams.startDate : "";
  const endDate = searchParams.endDate ? searchParams.endDate : "";
  const status = searchParams.status ? searchParams.status : "";

  if (!startDate && !endDate) {
    return [];
  }

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
    where: and(
      and(
        sql`DATE(${salesSchema.created_at}) >= ${startDate}`,
        sql`DATE(${salesSchema.created_at}) <= ${endDate}`,
        status ? eq(salesSchema.status, status) : undefined,
      ),
    ),
  });

  return sales;
}
