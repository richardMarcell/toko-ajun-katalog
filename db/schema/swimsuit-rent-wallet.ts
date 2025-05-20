import { SwimsuitRentReturnStatusEnum } from "@/lib/enums/SwimsuitRentReturnStatusEnum";
import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { salesDetails } from "./sales-details";
import { wallets } from "./wallets";

export const swimsuitRentWallet = mysqlTable("swimsuit_rent_wallet", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  sales_detail_id: bigint("sales_detail_id", {
    mode: "bigint",
    unsigned: true,
  })
    .notNull()
    .references(() => salesDetails.id, { onDelete: "restrict" }),
  wallet_id: bigint("wallet_id", {
    mode: "bigint",
    unsigned: true,
  }).references(() => wallets.id, { onDelete: "restrict" }),
  return_status: varchar("return_status", { length: 255 })
    .notNull()
    .default(SwimsuitRentReturnStatusEnum.NOT_RETURNED),
  returned_at: timestamp("returned_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const swimsuitRentWalletRelations = relations(
  swimsuitRentWallet,
  ({ one }) => ({
    saleDetail: one(salesDetails, {
      fields: [swimsuitRentWallet.sales_detail_id],
      references: [salesDetails.id],
    }),
    wallet: one(wallets, {
      fields: [swimsuitRentWallet.wallet_id],
      references: [wallets.id],
    }),
  }),
);
