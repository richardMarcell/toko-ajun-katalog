import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  decimal,
  float,
  int,
  json,
  longtext,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { products } from "./products";
import { sales } from "./sales";
import { swimsuitRentWallet } from "./swimsuit-rent-wallet";
import { promoSaleDetail } from "./promo-sale-detail";

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
  warehouse_id: varchar("warehouse_id", { length: 255 }).notNull(),
  order_status: varchar("order_status", { length: 255 }), // Menyimpan status pesanan pada penjualan pos resto atau food dengan nilai PREPARING, SERVE
  note: longtext("note"),
  qty: int("qty", { unsigned: true }).notNull().default(0),
  price: decimal("price", { precision: 24, scale: 8 }).notNull(),
  subtotal: decimal("subtotal", { precision: 24, scale: 8 }).notNull(),
  is_send_to_scm: boolean("is_send_to_scm").default(true),
  subject_to_tax: boolean("subject_to_tax").default(true),
  extras: json("extras"),
  discount_percent_sale: float("discount_percent_sale").notNull().default(0),
  discount_amount_sale: decimal("discount_amount_sale", {
    precision: 24,
    scale: 8,
  })
    .notNull()
    .default("0"),
  discount_percent_detail: float("discount_percent_detail").notNull().default(0),
  discount_amount_detail: decimal("discount_amount_detail", {
    precision: 24,
    scale: 8,
  })
    .notNull()
    .default("0"),
  tax_percent: float("tax_percent").notNull().default(0),
  tax_amount: decimal("tax_amount", {
    precision: 24,
    scale: 8,
  })
    .notNull()
    .default("0"),
  total_net: decimal("total_net", { precision: 24, scale: 8 }).notNull(),
  total_final: decimal("total_final", { precision: 24, scale: 8 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const salesDetailsRelations = relations(
  salesDetails,
  ({ one, many }) => ({
    sale: one(sales, {
      fields: [salesDetails.sales_id],
      references: [sales.id],
    }),

    product: one(products, {
      fields: [salesDetails.product_id],
      references: [products.id],
    }),

    swimsuitRentWallet: one(swimsuitRentWallet),

    promoSaleDetail: many(promoSaleDetail),
  }),
);
