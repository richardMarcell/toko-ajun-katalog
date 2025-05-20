import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { sales } from "./sales";
import { relations } from "drizzle-orm";

export const salesFoodCorner = mysqlTable("sales_food_corner", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  sales_id: bigint("sales_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => sales.id, { onDelete: "restrict" }),
  order_number: varchar("order_number", { length: 255 }).notNull(),
  table_number: varchar("table_number", { length: 5 }),
  order_type: varchar("order_type", { length: 255 }).notNull(), // DINE IN, TAKE AWAY
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const salesFoodCornerRelations = relations(
  salesFoodCorner,
  ({ one }) => ({
    sale: one(sales, {
      fields: [salesFoodCorner.sales_id],
      references: [sales.id],
    }),
  }),
);
