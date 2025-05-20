import { relations } from "drizzle-orm";
import {
  bigint,
  decimal,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { payments } from "./payments";

export const paymentVouchers = mysqlTable("payment_vouchers", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  payment_id: bigint("payment_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => payments.id, { onDelete: "restrict" }),
  code: varchar("code", { length: 255 }).notNull(),
  amount: decimal("amount", {
    precision: 24,
    scale: 8,
  }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const paymentVoucherRelations = relations(
  paymentVouchers,
  ({ one }) => ({
    payment: one(payments, {
      fields: [paymentVouchers.payment_id],
      references: [payments.id],
    }),
  }),
);
