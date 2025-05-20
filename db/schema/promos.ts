import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  date,
  decimal,
  float,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { bookletPromo } from "./booklet-promo";
import { bookletUsedPromos } from "./booklet-used-promos";
import { promoSale } from "./promo-sale";
import { unitBusinessHasPromo } from "./unit-business-has-promo";
import { promoSaleDetail } from "./promo-sale-detail";

export const promos = mysqlTable("promos", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  code: varchar("code", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  short_description: varchar("short_description", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  percentage: float("percentage").notNull().default(0),
  amount: decimal("amount", { precision: 24, scale: 8 }).notNull(),
  is_required_booklet: boolean("is_required_booklet").default(false).notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  periode_start: date("periode_start").notNull(),
  periode_end: date("periode_end").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const promosRelations = relations(promos, ({ many }) => ({
  bookletPromos: many(bookletPromo),
  bookletUsedPromos: many(bookletUsedPromos),
  promoSale: many(promoSale),
  unitBusinessHasPromo: many(unitBusinessHasPromo),
  promoSaleDetail: many(promoSaleDetail),
}));
