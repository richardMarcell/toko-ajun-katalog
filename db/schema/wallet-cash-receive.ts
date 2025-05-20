import { relations } from "drizzle-orm";
import {
  bigint,
  decimal,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { walletHistories } from "./wallet-histories";
import { users } from "./users";

export const walletCashReceive = mysqlTable("wallet_cash_receive", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  grand_total: decimal("grand_total", {
    precision: 24,
    scale: 8,
  }).notNull(),
  total_payment: decimal("total_payment", {
    precision: 24,
    scale: 8,
  }).notNull(),
  change_amount: decimal("change_amount", {
    precision: 24,
    scale: 8,
  }).notNull(),
  payment_method: varchar("payment_method", { length: 255 }).notNull(),
  created_by: bigint("created_by", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const walletCashReceiveRelations = relations(
  walletCashReceive,
  ({ many, one }) => ({
    walletHistories: many(walletHistories),
    user: one(users, {
      fields: [walletCashReceive.created_by],
      references: [users.id],
    }),
  }),
);
