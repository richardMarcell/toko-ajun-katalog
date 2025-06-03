import {
  bigint,
  decimal,
  int,
  longtext,
  mysqlTable,
  timestamp,
} from "drizzle-orm/mysql-core";
import { products } from "./products";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const carts = mysqlTable("carts", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  user_id: bigint("user_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
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

export const cartRelations = relations(carts, ({ one }) => ({
  product: one(products, {
    fields: [carts.product_id],
    references: [products.id],
  }),
  user: one(users, {
    fields: [carts.user_id],
    references: [users.id],
  }),
}));
