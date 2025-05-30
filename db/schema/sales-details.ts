import { relations } from "drizzle-orm";
import {
  bigint,
  decimal,
  int,
  longtext,
  mysqlTable,
  timestamp,
} from "drizzle-orm/mysql-core";
import { products } from "./products";
import { sales } from "./sales";

export const salesDetails = mysqlTable("sales_details", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  sales_id: bigint("sales_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => sales.id, { onDelete: "restrict" }),
  product_id: bigint("product_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),
  note: longtext("note"),
  qty: int("qty", { unsigned: true }).notNull().default(0),
  price: decimal("price", { precision: 24, scale: 8 }).notNull(),
  subtotal: decimal("subtotal", { precision: 24, scale: 8 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const salesDetailsRelations = relations(salesDetails, ({ one }) => ({
  sale: one(sales, {
    fields: [salesDetails.sales_id],
    references: [sales.id],
  }),

  product: one(products, {
    fields: [salesDetails.product_id],
    references: [products.id],
  }),
}));
