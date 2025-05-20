import { relations } from "drizzle-orm";
import { bigint, int, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { products } from "./products";

export const stockSwimsuitRent = mysqlTable("stock_swimsuit_rent", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  product_id: bigint("product_id", {
    mode: "bigint",
    unsigned: true,
  }).references(() => products.id, { onDelete: "restrict" }),
  qty: int("qty", { unsigned: true }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const stockSwimsuitRentRelations = relations(
  stockSwimsuitRent,
  ({ one }) => ({
    product: one(products, {
      fields: [stockSwimsuitRent.product_id],
      references: [products.id],
    }),
  }),
);
