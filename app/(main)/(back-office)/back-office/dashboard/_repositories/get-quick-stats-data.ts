import { db } from "@/db";
import { salesDetails, wallets, wristbands } from "@/db/schema";
import { ProductConfig } from "@/lib/config/product-config";
import { WalletStatusEnum } from "@/lib/enums/WalletStatusEnum";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import { and, count, eq, inArray, sql } from "drizzle-orm";

type QuickStatResponse = {
  totalCustomersNotRefunded: number;
  totalWristbandsHasNotReturned: number;
  customers: {
    category: string;
    total: number;
  }[];
  totalCustomers: number;
};

export async function getQuickStatsData(): Promise<QuickStatResponse> {
  const totalCustomersNotRefunded = await getTotalCustomerNotRefunded();
  const totalWristbandsHasNotReturned =
    await getTotalWristbandsHasNotReturned();
  const totalCustomersAnakDewasa = await getTotalCustomersAnakDewasa();
  const totalCustomersAnakKurang80cm = await getTotalCustomersAnakKurang80cm();
  const totalCustomersLansia = await getTotalCustomersLansia();
  const totalCustomersOnline = await getTotalCustomersOnline();

  const customers = [
    {
      category: "Anak/Dewasa",
      total: totalCustomersAnakDewasa,
    },
    {
      category: "Anak < 80cm",
      total: totalCustomersAnakKurang80cm,
    },
    {
      category: "Lansia",
      total: totalCustomersLansia,
    },
    {
      category: "Online",
      total: totalCustomersOnline,
    },
  ];

  const totalCustomers =
    totalCustomersAnakDewasa +
    totalCustomersAnakKurang80cm +
    totalCustomersLansia +
    totalCustomersOnline;

  return {
    totalCustomersNotRefunded,
    totalWristbandsHasNotReturned,
    customers,
    totalCustomers,
  };
}

async function getTotalCustomerNotRefunded(): Promise<number> {
  const totalCustomersNotRefunded = await db
    .select({
      total: count(),
    })
    .from(wallets)
    .where(
      and(
        eq(wallets.status, WalletStatusEnum.OPEN),
        sql`DATE(${wallets.created_at}) = CURRENT_DATE()`,
      ),
    );

  return Number(totalCustomersNotRefunded[0].total);
}

async function getTotalWristbandsHasNotReturned(): Promise<number> {
  const totalWristbandsHasNotReturned = await db
    .select({
      total: count(),
    })
    .from(wristbands)
    .where(eq(wristbands.status, WristbandStatusEnum.IN_USE));

  return Number(totalWristbandsHasNotReturned[0].total);
}

async function getTotalCustomersAnakDewasa(): Promise<number> {
  const totalCustomersAnakDewasa = await db
    .select({
      total: sql<number>`SUM(${salesDetails.qty})`,
    })
    .from(salesDetails)
    .where(
      and(
        inArray(salesDetails.product_id, [
          ProductConfig.ticket.anak_dewasa_weekday.id,
          ProductConfig.ticket.anak_dewasa_weekend.id,
        ]),
        sql`DATE(${salesDetails.created_at}) = CURRENT_DATE()`,
      ),
    );

  return Number(totalCustomersAnakDewasa[0].total) ?? 0;
}

async function getTotalCustomersAnakKurang80cm(): Promise<number> {
  const totalCustomersAnakKurang80cm = await db
    .select({
      total: sql<number>`SUM(${salesDetails.qty})`,
    })
    .from(salesDetails)
    .where(
      and(
        eq(salesDetails.product_id, ProductConfig.ticket.anak_kurang_80cm.id),
        sql`DATE(${salesDetails.created_at}) = CURRENT_DATE()`,
      ),
    );

  return Number(totalCustomersAnakKurang80cm[0].total) ?? 0;
}

async function getTotalCustomersLansia(): Promise<number> {
  const totalCustomersLansia = await db
    .select({
      total: sql<number>`SUM(${salesDetails.qty})`,
    })
    .from(salesDetails)
    .where(
      and(
        eq(salesDetails.product_id, ProductConfig.ticket.lansia.id),
        sql`DATE(${salesDetails.created_at}) = CURRENT_DATE()`,
      ),
    );

  return Number(totalCustomersLansia[0].total) ?? 0;
}

async function getTotalCustomersOnline(): Promise<number> {
  const totalCustomersOnline = await db
    .select({
      total: sql<number>`SUM(${salesDetails.qty})`,
    })
    .from(salesDetails)
    .where(
      and(
        eq(salesDetails.product_id, ProductConfig.ticket.anak_dewasa_online.id),
        sql`DATE(${salesDetails.created_at}) = CURRENT_DATE()`,
      ),
    );

  return Number(totalCustomersOnline[0].total) ?? 0;
}
