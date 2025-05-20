import { relations } from "drizzle-orm";
import { bigint, decimal, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { promos } from "./promos";
import { sales } from "./sales";

export const promoSale = mysqlTable("promo_sale", {
  promo_id: bigint("promo_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => promos.id, { onDelete: "restrict" }),
  sales_id: bigint("sales_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => sales.id, { onDelete: "restrict" }),
  discount_amount: decimal("discount_amount", {
    precision: 24,
    scale: 8,
  }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const promoSaleRelations = relations(promoSale, ({ one }) => ({
  promo: one(promos, {
    fields: [promoSale.promo_id],
    references: [promos.id],
  }),
  sale: one(sales, {
    fields: [promoSale.sales_id],
    references: [sales.id],
  }),
}));
