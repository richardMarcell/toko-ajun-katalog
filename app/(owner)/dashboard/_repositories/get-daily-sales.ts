import { db } from "@/db";
import { sales } from "@/db/schema";
import { SalesStatusEnum } from "@/lib/enums/SalesStatusEnum";
import { eq, sql, sum } from "drizzle-orm";

export async function getDailySales(): Promise<
  {
    date: string;
    total: number;
  }[]
> {
  const result = await db
    .select({
      date: sql<string>`DATE(${sales.created_at})`.as("date"),
      total: sum(sales.grand_total).as("total"),
    })
    .from(sales)
    .groupBy(sql`DATE(${sales.created_at})`)
    .orderBy(sql`DATE(${sales.created_at}) ASC`)
    .where(eq(sales.status, SalesStatusEnum.CLOSED));

  return result.map((result) => ({
    date: result.date,
    total: Number(result.total) ?? 0,
  }));
}
