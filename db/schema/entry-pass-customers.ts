import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { entryPassCustomerHistories } from "./entry-pass-customer-histories";
import { salesEntryPass } from "./sales-entry-pass";

export const entryPassCustomers = mysqlTable("entry_pass_customers", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  national_id_number: varchar("national_id_number", { length: 20 }).unique(),
  phone_number: varchar("phone_number", { length: 20 }).notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const entryPassCustomersRelations = relations(
  entryPassCustomers,
  ({ many }) => ({
    entryPassCustomerHistories: many(entryPassCustomerHistories),
    salesEntryPass: many(salesEntryPass),
  }),
);
