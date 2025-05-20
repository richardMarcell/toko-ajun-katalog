import { relations } from "drizzle-orm";
import { bigint, decimal, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { promos } from "./promos";
import { salesDetails } from "./sales-details";

export const promoSaleDetail = mysqlTable("promo_sale_detail", {
  promo_id: bigint("promo_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => promos.id, { onDelete: "restrict" }),
  sale_detail_id: bigint("sale_detail_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => salesDetails.id, { onDelete: "restrict" }),
  discount_amount: decimal("discount_amount", {
    precision: 24,
    scale: 8,
  }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const promoSaleDetailRelations = relations(
  promoSaleDetail,
  ({ one }) => ({
    promo: one(promos, {
      fields: [promoSaleDetail.promo_id],
      references: [promos.id],
    }),
    saleDetail: one(salesDetails, {
      fields: [promoSaleDetail.sale_detail_id],
      references: [salesDetails.id],
    }),
  }),
);
