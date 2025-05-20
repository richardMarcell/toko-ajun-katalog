import { relations } from "drizzle-orm";
import {
  bigint,
  decimal,
  longtext,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { productCategories } from "./product-categories";
import { salesDetails } from "./sales-details";

export const products = mysqlTable("products", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  code: varchar("code", { length: 255 }).unique().notNull(),
  price: decimal("price", { precision: 24, scale: 8 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  product_category_id: bigint("product_category_id", {
    mode: "bigint",
    unsigned: true,
  })
    .references(() => productCategories.id, { onDelete: "restrict" })
    .notNull(),
  description: longtext("description").notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const productRelations = relations(products, ({ many, one }) => ({
  salesDetails: many(salesDetails),

  productCategory: one(productCategories, {
    fields: [products.product_category_id],
    references: [productCategories.id],
  }),
}));
