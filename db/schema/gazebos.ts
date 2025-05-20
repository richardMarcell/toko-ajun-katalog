import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { gazeboWallet } from "./gazebo-wallet";
import { products } from "./products";

export const gazebos = mysqlTable("gazebos", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  product_id: bigint("product_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),
  label: varchar("label", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  status: varchar("status", { length: 225 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const gazeboRelations = relations(gazebos, ({ many, one }) => ({
  gazeboWallets: many(gazeboWallet),
  product: one(products, {
    fields: [gazebos.product_id],
    references: [products.id],
  }),
}));
