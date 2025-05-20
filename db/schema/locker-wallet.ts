import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { wallets } from "./wallets";
import { lockers } from "./lockers";
import { relations } from "drizzle-orm";
import { LockerWalletPaymentStatusEnum } from "@/lib/enums/LockerWalletPaymentStatusEnum";
import { LockerWalletStatusEnum } from "@/lib/enums/LockerWalletStatusEnum";
import { LockerWalletReturnStatusEnum } from "@/lib/enums/LockerWalletReturnStatusEnum";
import { users } from "./users";
import { walletHistories } from "./wallet-histories";

export const lockerWallet = mysqlTable("locker_wallet", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  wallet_id: bigint("wallet_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => wallets.id, { onDelete: "restrict" }),
  locker_id: bigint("locker_id", { mode: "bigint", unsigned: true }).references(
    () => lockers.id,
    { onDelete: "restrict" },
  ),
  wallet_history_id: bigint("wallet_history_id", {
    mode: "bigint",
    unsigned: true,
  })
    .notNull()
    .references(() => walletHistories.id, { onDelete: "restrict" }),
  type: varchar("type", { length: 225 }).notNull(),
  status: varchar("status", { length: 225 }).default(
    LockerWalletStatusEnum.OPEN,
  ),
  payment_status: varchar("payment_status", { length: 225 }).default(
    LockerWalletPaymentStatusEnum.UNPAID,
  ),
  return_status: varchar("return_status", { length: 255 })
    .notNull()
    .default(LockerWalletReturnStatusEnum.NOT_RETURNED),
  returned_at: timestamp("returned_at"),
  created_by: bigint("created_by", {
    mode: "bigint",
    unsigned: true,
  }).references(() => users.id, { onDelete: "restrict" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const lockerWalletRelations = relations(lockerWallet, ({ one }) => ({
  wallet: one(wallets, {
    fields: [lockerWallet.wallet_id],
    references: [wallets.id],
  }),
  walletHistory: one(walletHistories, {
    fields: [lockerWallet.wallet_history_id],
    references: [walletHistories.id],
  }),
  locker: one(lockers, {
    fields: [lockerWallet.locker_id],
    references: [lockers.id],
  }),
  user: one(users, {
    fields: [lockerWallet.created_by],
    references: [users.id],
  }),
}));
