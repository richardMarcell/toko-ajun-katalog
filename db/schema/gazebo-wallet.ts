import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { wallets } from "./wallets";
import { relations } from "drizzle-orm";
import { gazebos } from "./gazebos";
import { GazeboWalletStatusEnum } from "@/lib/enums/GazeboWalletStatusEnum";
import { GazeboWalletPaymentStatusEnum } from "@/lib/enums/GazeboWalletPaymentStatusEnum";
import { users } from "./users";
import { GazeboWalletReturnStatusEnum } from "@/lib/enums/GazeboWalletReturnStatusEnum";
import { walletHistories } from "./wallet-histories";

export const gazeboWallet = mysqlTable("gazebo_wallet", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  wallet_id: bigint("wallet_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => wallets.id, { onDelete: "restrict" }),
  gazebo_id: bigint("gazebo_id", { mode: "bigint", unsigned: true }).references(
    () => gazebos.id,
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
    GazeboWalletStatusEnum.OPEN,
  ),
  payment_status: varchar("payment_status", { length: 225 }).default(
    GazeboWalletPaymentStatusEnum.UNPAID,
  ),
  return_status: varchar("return_status", { length: 255 })
    .notNull()
    .default(GazeboWalletReturnStatusEnum.NOT_RETURNED),
  returned_at: timestamp("returned_at"),
  created_by: bigint("created_by", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const gazeboWalletRelations = relations(gazeboWallet, ({ one }) => ({
  wallet: one(wallets, {
    fields: [gazeboWallet.wallet_id],
    references: [wallets.id],
  }),
  walletHistory: one(walletHistories, {
    fields: [gazeboWallet.wallet_history_id],
    references: [walletHistories.id],
  }),
  gazebo: one(gazebos, {
    fields: [gazeboWallet.gazebo_id],
    references: [gazebos.id],
  }),
  user: one(users, {
    fields: [gazeboWallet.created_by],
    references: [users.id],
  }),
}));
