import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { swimmingClassCustomerHistories } from "./swimming-class-customer-histories";
import { salesSwimmingClass } from "./sales-swimming-class";

export const swimmingClassCustomers = mysqlTable("swimming_class_customers", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  national_id_number: varchar("national_id_number", { length: 20 }).unique(),
  phone_number: varchar("phone_number", { length: 20 }).notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const swimmingClassCustomersRelations = relations(
  swimmingClassCustomers,
  ({ many }) => ({
    swimmingClassCustomerHistories: many(swimmingClassCustomerHistories),
    salesSwimmingClass: many(salesSwimmingClass),
  }),
);
