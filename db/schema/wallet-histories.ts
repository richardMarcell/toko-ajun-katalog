import {
  bigint,
  boolean,
  decimal,
  foreignKey,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { wallets } from "./wallets";
import { sales } from "./sales";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { walletCashReceive } from "./wallet-cash-receive";
import { walletCashRefunds } from "./wallet-cash-refunds";
import { walletWristband } from "./wallet-wristband";
import { lockerWallet } from "./locker-wallet";
import { gazeboWallet } from "./gazebo-wallet";

export const walletHistories = mysqlTable(
  "wallet_histories",
  {
    id: bigint("id", { mode: "bigint", unsigned: true })
      .primaryKey()
      .autoincrement(),
    wallet_id: bigint("wallet_id", { mode: "bigint", unsigned: true })
      .notNull()
      .references(() => wallets.id, { onDelete: "restrict" }),
    // NOTE: sale id dan sales id memiliki peruntukan yang sama
    sale_id: bigint("sale_id", { mode: "bigint", unsigned: true }).references(
      () => sales.id,
      { onDelete: "restrict" },
    ),
    wallet_cash_receive_id: bigint("wallet_cash_receive_id", {
      mode: "bigint",
      unsigned: true,
    }), // Relasi dengan table wallet cash receive dan hanya terisi ketika terjadi transaksi top up dan deposit
    wallet_cash_refund_id: bigint("wallet_cash_refund_id", {
      mode: "bigint",
      unsigned: true,
    }), // Relasi dengan table wallet cash refund dan hanya terisi ketika terjadi transaksi penarikan deposit, penarikan saldo dan denda gelang
    transaction_type: varchar("transaction_type", { length: 225 }).notNull(),
    prev_saldo: decimal("prev_saldo", { precision: 24, scale: 8 }).notNull(),
    current_saldo: decimal("current_saldo", {
      precision: 24,
      scale: 8,
    }).notNull(),
    amount: decimal("amount", { precision: 24, scale: 8 }).notNull(),
    deposit_wristband_qty: int("deposit_wristband_qty", { unsigned: true }), // Mencatat kuantitas gelang yang disewa saat itu
    is_void: boolean("is_void").default(false),
    voided_by: bigint("voided_by", {
      mode: "bigint",
      unsigned: true,
    }).references(() => users.id, { onDelete: "restrict" }),
    voided_at: timestamp("voided_at"),
    created_by: bigint("created_by", { mode: "bigint", unsigned: true })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.wallet_cash_receive_id],
      foreignColumns: [walletCashReceive.id],
      name: "fk_wallet_histories_wallet_cash_receive",
    }),
  ],
);

export const walletHistoriesRelations = relations(
  walletHistories,
  ({ one, many }) => ({
    wallet: one(wallets, {
      fields: [walletHistories.wallet_id],
      references: [wallets.id],
    }),
    sale: one(sales, {
      fields: [walletHistories.sale_id],
      references: [sales.id],
    }),
    user: one(users, {
      fields: [walletHistories.created_by],
      references: [users.id],
    }),
    voidedBy: one(users, {
      fields: [walletHistories.voided_by],
      references: [users.id],
    }),
    walletCashReceive: one(walletCashReceive, {
      fields: [walletHistories.wallet_cash_receive_id],
      references: [walletCashReceive.id],
    }),
    walletCashRefund: one(walletCashRefunds, {
      fields: [walletHistories.wallet_cash_refund_id],
      references: [walletCashRefunds.id],
    }),

    lockerWallets: many(lockerWallet),
    gazeboWallets: many(gazeboWallet),
    walletWristbands: many(walletWristband),
  }),
);
