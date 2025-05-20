import { relations } from "drizzle-orm";
import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { walletWristband } from "./wallet-wristband";
import { salesSwimsuitRent } from "./sales-swimsuit-rent";
import { lockers } from "./lockers";

export const wristbands = mysqlTable("wristbands", {
  code: varchar("code", { length: 255 }).primaryKey(),
  status: varchar("status", { length: 225 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const wristbandRelations = relations(wristbands, ({ many }) => ({
  walletWristbands: many(walletWristband),
  salesSwimsuitRentList: many(salesSwimsuitRent),
  lockers: many(lockers),
}));
