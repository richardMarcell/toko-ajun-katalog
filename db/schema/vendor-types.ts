import { relations } from "drizzle-orm";
import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { payments } from "./payments";

export const vendorTypes = mysqlTable("vendor_types", {
  code: varchar("code", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).unique().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const vendorTypesRelations = relations(vendorTypes, ({ many }) => ({
  payments: many(payments),
}));
