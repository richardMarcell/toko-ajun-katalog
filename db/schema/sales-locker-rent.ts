import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { sales } from "./sales";
import { relations } from "drizzle-orm";

export const salesLockerRent = mysqlTable("sales_locker_rent", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  sales_id: bigint("sales_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => sales.id, { onDelete: "restrict" }),
  promo_type: varchar("promo_type", { length: 255 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const salesLockerRentRelations = relations(
  salesLockerRent,
  ({ one }) => ({
    sale: one(sales, {
      fields: [salesLockerRent.sales_id],
      references: [sales.id],
    }),
  }),
);
