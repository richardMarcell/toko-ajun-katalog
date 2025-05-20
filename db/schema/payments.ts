import { relations } from "drizzle-orm";
import {
  bigint,
  decimal,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { sales } from "./sales";
import { vendorTypes } from "./vendor-types";
import { wallets } from "./wallets";
import { paymentVouchers } from "./payment-vouchers";

export const payments = mysqlTable("payments", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  sales_id: bigint("sales_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => sales.id, { onDelete: "restrict" }),
  payment_method: varchar("payment_method", { length: 255 }).notNull(),
  total_payment: decimal("total_payment", {
    precision: 24,
    scale: 8,
  }).notNull(),
  change_amount: decimal("change_amount", {
    precision: 24,
    scale: 8,
  }).notNull(),

  // Payment Method OTA Redemption
  ota_redeem_code: varchar("ota_redeem_code", { length: 255 }).unique(), // Mencatat redeem code dari online travel agent
  vendor_type_code: varchar("vendor_type_code", { length: 255 }).references(
    () => vendorTypes.code,
    { onDelete: "restrict" },
  ),

  // Payment Method CashQ
  wristband_code: varchar("wristband_code", { length: 255 }),
  wallet_id: bigint("wallet_id", { mode: "bigint", unsigned: true }).references(
    () => wallets.id,
    { onDelete: "restrict" },
  ),

  // Payment Method Debit
  cardholder_name: varchar("cardholder_name", { length: 255 }),
  debit_card_number: varchar("debit_card_number", { length: 255 }),
  referenced_id: varchar("referenced_id", { length: 255 }),
  debit_issuer_bank: varchar("debit_issuer_bank", { length: 255 }),

  // Payment Method Credit Card
  credit_card_number: varchar("credit_card_number", { length: 255 }),

  // Payment Method Qris
  qris_issuer: varchar("qris_issuer", { length: 255 }),

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  sale: one(sales, {
    fields: [payments.sales_id],
    references: [sales.id],
  }),
  vendorType: one(vendorTypes, {
    fields: [payments.vendor_type_code],
    references: [vendorTypes.code],
  }),
  wallet: one(wallets, {
    fields: [payments.wallet_id],
    references: [wallets.id],
  }),
  paymentVouchers: many(paymentVouchers),
}));
