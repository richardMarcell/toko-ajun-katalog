import { db } from "@/db";
import { sales, users } from "@/db/schema";
import { SalesStatusEnum } from "@/lib/enums/SalesStatusEnum";
import { count, eq } from "drizzle-orm";

type Dashboard = {
  totalUsers: number;
  totalSales: number;
  totalSalesOpen: number;
  totalSalesClosed: number;
  totalSalesPreparing: number;
  totalSalesReady: number;
};

export async function getDashboardData(): Promise<Dashboard> {
  const totalUsers = await getTotalUsers();
  const totalSales = await getTotalSales();
  const totalSalesOpen = await getTotalSalesOpen();
  const totalSalesClosed = await getTotalSalesClosed();
  const totalSalesPreparing = await getTotalSalesPreparing();
  const totalSalesReady = await getTotalSalesReady();

  return {
    totalUsers,
    totalSales,
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
