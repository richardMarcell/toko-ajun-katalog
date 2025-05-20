import { relations } from "drizzle-orm";
import {
  bigint,
  decimal,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { walletWristband } from "./wallet-wristband";
import { walletHistories } from "./wallet-histories";
import { WalletStatusEnum } from "@/lib/enums/WalletStatusEnum";
import { lockerWallet } from "./locker-wallet";
import { gazeboWallet } from "./gazebo-wallet";
import { swimsuitRentWallet } from "./swimsuit-rent-wallet";
import { payments } from "./payments";
import { walletTicketSale } from "./wallet-ticket-sale";

export const wallets = mysqlTable("wallets", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  code: varchar("code", { length: 225 }),
  customer_name: varchar("customer_name", { length: 225 }).notNull(),
  customer_phone_number: varchar("customer_phone_number", {
    length: 225,
  }).notNull(),
  deposit_payment_method: varchar("deposit_payment_method", { length: 255 }),
  deposit_amount: decimal("deposit_amount", {
    precision: 24,
    scale: 8,
  }).notNull(),
  saldo: decimal("saldo", { precision: 24, scale: 8 }).notNull(),
  status: varchar("status", { length: 225 })
    .default(WalletStatusEnum.OPEN)
    .notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const walletRelations = relations(wallets, ({ one, many }) => ({
  lockerWallets: many(lockerWallet),
  gazeboWallets: many(gazeboWallet),
  swimsuitRentWallet: many(swimsuitRentWallet),
  walletWristbands: many(walletWristband),
  walletHistories: many(walletHistories),
  payments: many(payments),
  walletTicketSale: one(walletTicketSale),
}));
