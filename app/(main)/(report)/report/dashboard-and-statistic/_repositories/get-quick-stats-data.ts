import { db } from "@/db";
import { salesDetails, wallets } from "@/db/schema";
import { ProductConfig } from "@/lib/config/product-config";
import { WalletStatusEnum } from "@/lib/enums/WalletStatusEnum";
import { and, eq, inArray, sql } from "drizzle-orm";

type QuickStatResponse = {
  totalRefundAmount: number;
  totalCustomers: number;
  totalCashQ: number;
};

export async function getQuickStatsData(): Promise<QuickStatResponse> {
  const {totalRefundAmount, totalCashQ} = await getTotalRefundAmountAndTotalCashQ();

  // TODO: create service to get ticket by product ticket
  const totalCustomersAnakDewasa = await getTotalCustomersAnakDewasa();
  const totalCustomersAnakKurang80cm = await getTotalCustomersAnakKurang80cm();
  const totalCustomersLansia = await getTotalCustomersLansia();
  const totalCustomersOnline = await getTotalCustomersOnline();

  const totalCustomers =
    totalCustomersAnakDewasa +
    totalCustomersAnakKurang80cm +
    totalCustomersLansia +
    totalCustomersOnline;

  return {
    totalRefundAmount,
    totalCustomers,
    totalCashQ,
  };
}

async function getTotalRefundAmountAndTotalCashQ(): Promise<{
  totalRefundAmount: number;
  totalCashQ: number;
}> {
  const walletList = await db.query.wallets.findMany({
    where: and(eq(wallets.status, WalletStatusEnum.OPEN)),
  });

  const totalRefundAmount = walletList.reduce((sum, wallet) => {
    return sum + Number(wallet.saldo ?? 0) + Number(wallet.deposit_amount ?? 0);
  }, 0);

  return {
    totalRefundAmount,
    totalCashQ: walletList.length,
  };
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
