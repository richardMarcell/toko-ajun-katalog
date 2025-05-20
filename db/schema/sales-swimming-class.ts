import {
  bigint,
  int,
  mysqlTable,
  timestamp,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { sales } from "./sales";
import { swimmingClassCustomers } from "./swimming-class-customers";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const salesSwimmingClass = mysqlTable(
  "sales_swimming_class",
  {
    id: bigint("id", { mode: "bigint", unsigned: true })
      .primaryKey()
      .autoincrement(),
    sales_id: bigint("sales_id", { mode: "bigint", unsigned: true }).notNull(),
    sc_customer_id: bigint("sc_customer_id", {
      mode: "bigint",
      unsigned: true,
    }).notNull(), // relasi dengan table swimming_class_customers
    created_by: bigint("created_by", {
      mode: "bigint",
      unsigned: true,
    }).notNull(),
    valid_for: int("valid_for", { unsigned: true }), // Jumlah pertemuan dalam kelas yang dipilih customer
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.sales_id],
      foreignColumns: [sales.id],
      name: "fk_sales_swimming_class_sales",
    }),
    foreignKey({
      columns: [table.sc_customer_id],
      foreignColumns: [swimmingClassCustomers.id],
      name: "fk_sales_swimming_class_customer",
    }),
    foreignKey({
      columns: [table.created_by],
      foreignColumns: [users.id],
      name: "fk_sales_swimming_class_user",
    }),
  ],
);

export const salesSwimmingClassRelations = relations(
  salesSwimmingClass,
  ({ one }) => ({
    user: one(users, {
      fields: [salesSwimmingClass.created_by],
      references: [users.id],
    }),
    sale: one(sales, {
      fields: [salesSwimmingClass.sales_id],
      references: [sales.id],
    }),
    swimmingClassCustomer: one(swimmingClassCustomers, {
      fields: [salesSwimmingClass.sc_customer_id],
      references: [swimmingClassCustomers.id],
    }),
  }),
);
