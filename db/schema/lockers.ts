import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { lockerWallet } from "./locker-wallet";
import { products } from "./products";
import { wristbands } from "./wristbands";

export const lockers = mysqlTable("lockers", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  product_id: bigint("product_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),
  wristband_code: varchar("wristband_code", { length: 255 })
    .notNull()
    .references(() => wristbands.code, { onDelete: "restrict" }),
  label: varchar("label", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  status: varchar("status", { length: 225 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const lockerRelations = relations(lockers, ({ many, one }) => ({
  lockerWallets: many(lockerWallet),
  product: one(products, {
    fields: [lockers.product_id],
    references: [products.id],
  }),
  wristband: one(wristbands, {
    fields: [lockers.wristband_code],
    references: [wristbands.code],
  }),
}));
