import { relations } from "drizzle-orm";
import { bigint, decimal, int, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { walletHistories } from "./wallet-histories";
import { walletCashRefundDetails } from "./wallet-cash-refund-details";
import { users } from "./users";

export const walletCashRefunds = mysqlTable("wallet_cash_refunds", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  total_refund: decimal("total_refund", {
    precision: 24,
    scale: 8,
  }).notNull(),
  print_count: int("print_count", { unsigned: true }).notNull().default(0), // Menyimpan struk sudah diprint berapa kali
  created_by: bigint("created_by", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const walletCashRefundRelations = relations(
  walletCashRefunds,
  ({ one, many }) => ({
    walletHistories: many(walletHistories),
    createBy: one(users, {
      fields: [walletCashRefunds.created_by],
      references: [users.id],
    }),
    walletCashRefundDetails: many(walletCashRefundDetails),
  }),
);
