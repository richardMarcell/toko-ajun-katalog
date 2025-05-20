import { relations } from "drizzle-orm";
import {
  bigint,
  decimal,
  int,
  json,
  longtext,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { captainOrders } from "./captain-orders";
import { products } from "./products";

export const captainOrderDetails = mysqlTable("captain_order_details", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  captain_order_id: bigint("captain_order_id", {
    mode: "bigint",
    unsigned: true,
  })
    .notNull()
    .references(() => captainOrders.id, { onDelete: "restrict" }),
  product_id: bigint("product_id", {
    mode: "bigint",
    unsigned: true,
  })
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),
  warehouse_id: varchar("warehouse_id", { length: 255 }).notNull(),
  qty: int("qty", { unsigned: true }).notNull(),
  paid_qty: int("paid_qty", { unsigned: true }).notNull(), // Mencatat kuantitas produk yang sudah dibayar
  price: decimal("price", { precision: 24, scale: 8 }).notNull(),
  subtotal: decimal("subtotal", { precision: 24, scale: 8 }).notNull(),
  note: longtext("note"),
  extras: json("extras"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const captainOrderDetailRelations = relations(
  captainOrderDetails,
  ({ one }) => ({
    captainOrder: one(captainOrders, {
      fields: [captainOrderDetails.captain_order_id],
      references: [captainOrders.id],
    }),
    product: one(products, {
      fields: [captainOrderDetails.product_id],
      references: [products.id],
    }),
  }),
);
