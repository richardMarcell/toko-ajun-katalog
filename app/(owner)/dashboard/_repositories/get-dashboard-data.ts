import { db } from "@/db";
import { saleRatings, sales, users } from "@/db/schema";
import { SalesStatusEnum } from "@/lib/enums/SalesStatusEnum";
import { count, eq, sql } from "drizzle-orm";

type Dashboard = {
  totalUsers: number;
  totalSales: number;
  averageRating: number;
  totalSalesOpen: number;
  totalSalesClosed: number;
  totalSalesPreparing: number;
  totalSalesReady: number;
};

export async function getDashboardData(): Promise<Dashboard> {
  const totalUsers = await getTotalUsers();
  const totalSales = await getTotalSales();
  const averageRating = await getAverageRating();
  const totalSalesOpen = await getTotalSalesOpen();
  const totalSalesClosed = await getTotalSalesClosed();
  const totalSalesPreparing = await getTotalSalesPreparing();
  const totalSalesReady = await getTotalSalesReady();

  return {
    totalUsers,
    totalSales,
    averageRating,
    totalSalesOpen,
    totalSalesClosed,
    totalSalesPreparing,
    totalSalesReady,
  };
}

async function getTotalUsers(): Promise<number> {
  const totalUsers = await db
    .select({
      total: count(),
    })
    .from(users);
  return Number(totalUsers[0].total);
}

async function getTotalSales(): Promise<number> {
  const totalSales = await db
    .select({
      total: count(),
    })
    .from(sales);

  return Number(totalSales[0].total);
}

async function getAverageRating(): Promise<number> {
  const averageRating = await db
    .select({
      average: sql<number>`AVG(${saleRatings.rating})`.as("total"),
    })
    .from(saleRatings);
  return Number(averageRating[0].average) || 0;
}

async function getTotalSalesOpen(): Promise<number> {
  const totalSales = await db
    .select({
      total: count(),
    })
    .from(sales)
    .where(eq(sales.status, SalesStatusEnum.OPEN));

  return Number(totalSales[0].total);
}

async function getTotalSalesClosed(): Promise<number> {
  const totalSales = await db
    .select({
      total: count(),
    })
    .from(sales)
    .where(eq(sales.status, SalesStatusEnum.CLOSED));

  return Number(totalSales[0].total);
}

async function getTotalSalesPreparing(): Promise<number> {
  const totalSales = await db
    .select({
      total: count(),
    })
    .from(sales)
    .where(eq(sales.status, SalesStatusEnum.PREPARING));

  return Number(totalSales[0].total);
}

async function getTotalSalesReady(): Promise<number> {
  const totalSales = await db
    .select({
      total: count(),
    })
    .from(sales)
    .where(eq(sales.status, SalesStatusEnum.READY));

  return Number(totalSales[0].total);
}
