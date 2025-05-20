import { relations } from "drizzle-orm";
import {
  bigint,
  decimal,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { walletCashRefunds } from "./wallet-cash-refunds";
import { products } from "./products";

export const walletCashRefundDetails = mysqlTable(
  "wallet_cash_refund_details",
  {
    id: bigint("id", { mode: "bigint", unsigned: true })
      .primaryKey()
      .autoincrement(),
    wallet_cash_refund_id: bigint("wallet_cash_refund_id", {
      mode: "bigint",
      unsigned: true,
    }),
    item_name: varchar("item_name", { length: 255 }).notNull(),
    item_product_id: bigint("item_product_id", {
      mode: "bigint",
      unsigned: true,
    }).notNull(),
    item_qty: int("item_qty", { unsigned: true }).default(0).notNull(),
    subtotal: decimal("subtotal", { precision: 24, scale: 8 }).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
);

export const walletCashRefundDetailRelations = relations(
  walletCashRefundDetails,
  ({ one }) => ({
    walletCashRefund: one(walletCashRefunds, {
      fields: [walletCashRefundDetails.wallet_cash_refund_id],
      references: [walletCashRefunds.id],
    }),
    itemProduct: one(products, {
      fields: [walletCashRefundDetails.item_product_id],
      references: [products.id],
    }),
  }),
);
