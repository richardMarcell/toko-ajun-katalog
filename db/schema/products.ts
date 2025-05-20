import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  decimal,
  int,
  longtext,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { salesDetails } from "./sales-details";
import { stocks } from "./stocks";
import { tenants } from "./tenants";
import { swimmingClassCustomerHistories } from "./swimming-class-customer-histories";
import { entryPassCustomerHistories } from "./entry-pass-customer-histories";
import { stockSwimsuitRent } from "./stock-swimsuit-rent";
import { gazebos } from "./gazebos";
import { lockers } from "./lockers";
import { captainOrderDetails } from "./captain-order-details";
import { productCategories } from "./product-categories";

export const products = mysqlTable("products", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  fc_tenant_id: bigint("fc_tenant_id", {
    mode: "bigint",
    unsigned: true,
  }).references(() => tenants.id, { onDelete: "restrict" }), // relasi dengan table tenant dan hanya digunakan di food corner
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
  stock_type: varchar("stock_type", { length: 255 }).notNull(), // Menyimpan tipe produk dengan nilai STOCK atau NON STOCK
  swimming_class_valid_for: int("swimming_class_valid_for", { unsigned: true }), // Jumlah pertemuan dalam kelas renang yang dipilih customer dan digunakan di Swiming Class
  ep_valid_term: int("ep_valid_term", { unsigned: true }), // Menyimpan jangka waktu sebuah entry pass berlaku dalam konversi hari dan digunakan di Entry Pass
  ssr_penalty: decimal("ssr_penalty", { precision: 24, scale: 8 }), // Mencatat denda dari product pada sewa baju renang dan hanya digunakan di sewa baju renang
  is_rentable: boolean("is_rentable").default(false), // Identifier apakah sebuah product itu dapat disewakan atau tidak
  is_required_tax: boolean("is_required_tax").default(true).notNull(), // Identifier apakah suatu product dikenai pajak
  is_discountable: boolean("is_discountable").default(true).notNull(), // Identifier apakah suatu product boleh dikenai diskon
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const productRelations = relations(products, ({ many, one }) => ({
  salesDetails: many(salesDetails),

  tenant: one(tenants, {
    fields: [products.fc_tenant_id],
    references: [tenants.id],
  }),

  stocks: many(stocks),

  swimmingClassCustomerHistories: many(swimmingClassCustomerHistories),

  entryPassCustomerHistories: many(entryPassCustomerHistories),

  stockSwimsuitRent: one(stockSwimsuitRent),

  gazebos: many(gazebos),

  lockers: many(lockers),

  captainOrderDetails: many(captainOrderDetails),

  productCategory: one(productCategories, {
    fields: [products.product_category_id],
    references: [productCategories.id],
  }),
}));
