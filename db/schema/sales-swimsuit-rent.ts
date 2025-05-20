import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { sales } from "./sales";
import { wristbands } from "./wristbands";

export const salesSwimsuitRent = mysqlTable("sales_swimsuit_rent", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  sales_id: bigint("sales_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => sales.id, { onDelete: "restrict" }),
  wristband_code: varchar("wristband_code", { length: 255 })
    .notNull()
    .references(() => wristbands.code, { onDelete: "restrict" }),
  order_number: varchar("order_number", { length: 255 }).notNull(),
  customer_name: varchar("customer_name", { length: 255 }).notNull(),
  customer_phone_number: varchar("customer_phone_number", {
    length: 255,
  }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const salesSwimsuitRentRelations = relations(
  salesSwimsuitRent,
  ({ one }) => ({
    sale: one(sales, {
      fields: [salesSwimsuitRent.sales_id],
      references: [sales.id],
    }),
    wristband: one(wristbands, {
      fields: [salesSwimsuitRent.wristband_code],
      references: [wristbands.code],
    }),
  }),
);
