import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { sales } from "./sales";
import { customerOrigins } from "./customer-origins";

export const salesTicket = mysqlTable("sales_ticket", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  sales_id: bigint("sales_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => sales.id, { onDelete: "restrict" }),
  customer_name: varchar("customer_name", { length: 255 }).notNull(),
  customer_phone_number: varchar("customer_phone_number", {
    length: 255,
  }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const salesTicketRelations = relations(salesTicket, ({ one }) => ({
  sale: one(sales, {
    fields: [salesTicket.sales_id],
    references: [sales.id],
  }),
  customerOrigin: one(customerOrigins, {
    fields: [salesTicket.sales_id],
    references: [customerOrigins.id],
  }),
}));
