import { SalesStatusEnum } from "@/lib/enums/SalesStatusEnum";
import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  decimal,
  float,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { salesDetails } from "./sales-details";
import { salesFoodCorner } from "./sales-food-corner";
import { salesSouvenir } from "./sales-souvenir";
import { salesSwimmingClass } from "./sales-swimming-class";
import { salesLocker } from "./sales-locker";
import { swimmingClassCustomerHistories } from "./swimming-class-customer-histories";
import { entryPassCustomerHistories } from "./entry-pass-customer-histories";
import { salesEntryPass } from "./sales-entry-pass";
import { salesSwimsuitRent } from "./sales-swimsuit-rent";
import { salesDimsum } from "./sales-dimsum";
import { users } from "./users";
import { salesTicket } from "./sales-ticket";
import { bookletUsedPromos } from "./booklet-used-promos";
import { salesLockerRent } from "./sales-locker-rent";
import { salesGazeboRent } from "./sales-gazebo-rent";
import { promoSale } from "./promo-sale";
import { payments } from "./payments";
import { walletHistories } from "./wallet-histories";
import { walletTicketSale } from "./wallet-ticket-sale";
import { captainOrders } from "./captain-orders";

export const sales = mysqlTable("sales", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  captain_order_id: bigint("captain_order_id", {
    mode: "bigint",
    unsigned: true,
  }).references(() => captainOrders.id, { onDelete: "restrict" }),
  code: varchar("code", { length: 255 }).notNull().unique(),
  sales_status: varchar("sales_status", { length: 255 })
    .notNull()
    .default(SalesStatusEnum.OPEN), // OPEN, CLOSE
  discount_amount: decimal("discount_amount", {
    precision: 24,
    scale: 8,
  }).notNull(),
  discount_percent: float("discount_percent").notNull(),
  tax_amount: decimal("tax_amount", { precision: 24, scale: 8 }).notNull(),
  tax_percent: float("tax_percent").notNull(),
  total_gross: decimal("total_gross", {
    precision: 24,
    scale: 8,
  }).notNull(), // Menyimpan nominal penjualan yang belum termasuk diskon dan pajak
  total_net: decimal("total_net", {
    precision: 24,
    scale: 8,
  }).notNull(), // Menyimpan nominal penjualan kotor dikurangi jumlah diskon
  grand_total: decimal("grand_total", {
    precision: 24,
    scale: 8,
  }).notNull(), // Menyimpan nominal penjualan bersih ditambah pajak
  unit_business: varchar("unit_business", { length: 255 }).notNull(), // Menyimpan unit  bisnis yang melakukan penjualan => RESTO PATIO, DIMSUM, WATER PARK, dan lainnya
  transaction_type: varchar("transaction_type", { length: 255 }).notNull(), // Menyimpan tipe transaksi dari penjualan seperti => SWIMSUIT_RENT, TOP_UP, GAZEBO, dll
  print_count: int("print_count", { unsigned: true }).notNull().default(0), // Menyimpan struk sudah diprint berapa kali
  is_void: boolean("is_void").default(false),
  voided_by: bigint("voided_by", { mode: "bigint", unsigned: true }).references(
    () => users.id,
    { onDelete: "restrict" },
  ),
  voided_at: timestamp("voided_at"),
  created_by: bigint("created_by", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const salesRelations = relations(sales, ({ many, one }) => ({
  salesDetails: many(salesDetails),
  salesFoodCorner: one(salesFoodCorner),
  salesSouvenir: one(salesSouvenir),
  salesSwimmingClass: one(salesSwimmingClass),
  salesGazeboRent: one(salesGazeboRent),
  salesLockerRent: one(salesLockerRent),
  salesLocker: one(salesLocker),
  salesEntryPass: one(salesEntryPass),
  swimmingClassCustomerHistories: one(swimmingClassCustomerHistories),
  entryPassCustomerHistories: one(entryPassCustomerHistories),
  salesSwimsuitRent: one(salesSwimsuitRent),
  salesDimsum: one(salesDimsum),
  voidedBy: one(users, {
    fields: [sales.voided_by],
    references: [users.id],
  }),
  user: one(users, {
    fields: [sales.created_by],
    references: [users.id],
  }),
  salesTicket: one(salesTicket),
  bookletUsedPromos: many(bookletUsedPromos),
  promoSale: many(promoSale),
  payments: many(payments),
  walletHistory: one(walletHistories),
  walletTicketSale: one(walletTicketSale),
  captainOrder: one(captainOrders, {
    fields: [sales.captain_order_id],
    references: [captainOrders.id],
  }),
}));
