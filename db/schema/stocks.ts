import { relations } from "drizzle-orm";
import {
  bigint,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { products } from "./products";

export const stocks = mysqlTable("stocks", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  product_id: bigint("product_id", {
    mode: "bigint",
    unsigned: true,
  }).references(() => products.id, { onDelete: "restrict" }),
  warehouse_id: varchar("warehouse_id", { length: 255 }),
  qty: int("qty", { unsigned: true }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const stockRelations = relations(stocks, ({ one }) => ({
  product: one(products, {
    fields: [stocks.product_id],
    references: [products.id],
  }),
}));
