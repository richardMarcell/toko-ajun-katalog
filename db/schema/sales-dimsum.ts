import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { sales } from "./sales";
import { relations } from "drizzle-orm";

export const salesDimsum = mysqlTable("sales_dimsum", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  sales_id: bigint("sales_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => sales.id, { onDelete: "restrict" }),
  order_number: varchar("order_number", { length: 255 }).notNull(),
  table_number: varchar("table_number", { length: 5 }),
  customer_name: varchar("customer_name", { length: 255 }),
  order_type: varchar("order_type", { length: 255 }).notNull(), // DINE IN, TAKE AWAY
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const salesDimsumRelations = relations(salesDimsum, ({ one }) => ({
  sale: one(sales, {
    fields: [salesDimsum.sales_id],
    references: [sales.id],
  }),
}));
