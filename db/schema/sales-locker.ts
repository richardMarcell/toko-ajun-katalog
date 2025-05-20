import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { sales } from "./sales";
import { relations } from "drizzle-orm";

export const salesLocker = mysqlTable("sales_locker", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  sales_id: bigint("sales_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => sales.id, { onDelete: "restrict" }),
  customer_name: varchar("customer_name", { length: 255 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const salesLockerRelations = relations(salesLocker, ({ one }) => ({
  sale: one(sales, {
    fields: [salesLocker.sales_id],
    references: [sales.id],
  }),
}));
