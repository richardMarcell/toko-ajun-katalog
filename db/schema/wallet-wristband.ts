import {
  bigint,
  boolean,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { wallets } from "./wallets";
import { wristbands } from "./wristbands";
import { relations } from "drizzle-orm";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";
import { WalletWristbandReturnStatusEnum } from "@/lib/enums/WalletWristbandReturnStatusEnum";
import { users } from "./users";
import { walletHistories } from "./wallet-histories";

export const walletWristband = mysqlTable("wallet_wristband", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  wallet_id: bigint("wallet_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => wallets.id, { onDelete: "restrict" }),
  wristband_code: varchar("wristband_code", { length: 255 })
    .notNull()
    .references(() => wristbands.code, { onDelete: "restrict" }),
  wallet_history_id: bigint("wallet_history_id", {
    mode: "bigint",
    unsigned: true,
  })
    .notNull()
    .references(() => walletHistories.id, { onDelete: "restrict" }),
  status: varchar("status", { length: 255 })
    .notNull()
    .default(WalletWristbandStatusEnum.OPEN),
  return_status: varchar("return_status", { length: 255 })
    .notNull()
    .default(WalletWristbandReturnStatusEnum.RENTED),
  returned_at: timestamp("returned_at"),
  is_deposit_wristband_returned: boolean(
    "is_deposit_wristband_returned",
  ).default(false),
  deposit_wristband_returned_by: bigint("deposit_wristband_returned_by", {
    mode: "bigint",
    unsigned: true,
  }).references(() => users.id, { onDelete: "restrict" }),
  deposit_wristband_returned_at: timestamp("deposit_wristband_returned_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const walletWristbandRelations = relations(
  walletWristband,
  ({ one }) => ({
    wallet: one(wallets, {
      fields: [walletWristband.wallet_id],
      references: [wallets.id],
    }),
    walletHistory: one(walletHistories, {
      fields: [walletWristband.wallet_history_id],
      references: [walletHistories.id],
    }),
    wristband: one(wristbands, {
      fields: [walletWristband.wristband_code],
      references: [wristbands.code],
    }),
    depositWristbandReturnedBy: one(users, {
      fields: [walletWristband.deposit_wristband_returned_by],
      references: [users.id],
    }),
  }),
);
