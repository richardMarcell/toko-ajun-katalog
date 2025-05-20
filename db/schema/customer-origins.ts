import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { salesTicket } from "./sales-ticket";

export const customerOrigins = mysqlTable("customer_origins", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const customerOriginRelations = relations(
  customerOrigins,
  ({ many }) => ({
    salesTickets: many(salesTicket),
  }),
);
