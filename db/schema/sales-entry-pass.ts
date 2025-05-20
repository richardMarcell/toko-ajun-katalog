import { relations } from "drizzle-orm";
import {
  bigint,
  foreignKey,
  mysqlTable,
  timestamp,
} from "drizzle-orm/mysql-core";
import { entryPassCustomers } from "./entry-pass-customers";
import { sales } from "./sales";
import { users } from "./users";

export const salesEntryPass = mysqlTable(
  "sales_entry_pass",
  {
    id: bigint("id", { mode: "bigint", unsigned: true })
      .primaryKey()
      .autoincrement(),
    sales_id: bigint("sales_id", { mode: "bigint", unsigned: true }).notNull(),
    ep_customer_id: bigint("ep_customer_id", {
      mode: "bigint",
      unsigned: true,
    }).notNull(), // relasi dengan table entry_pass_customers
    created_by: bigint("created_by", {
      mode: "bigint",
      unsigned: true,
    }).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.sales_id],
      foreignColumns: [sales.id],
      name: "fk_salentry_pass_sales",
    }),
    foreignKey({
      columns: [table.ep_customer_id],
      foreignColumns: [entryPassCustomers.id],
      name: "fk_salentry_pass_customer",
    }),
    foreignKey({
      columns: [table.created_by],
      foreignColumns: [users.id],
      name: "fk_salentry_pass_user",
    }),
  ],
);

export const salesEntryPassRelations = relations(salesEntryPass, ({ one }) => ({
  user: one(users, {
    fields: [salesEntryPass.created_by],
    references: [users.id],
  }),
  sale: one(sales, {
    fields: [salesEntryPass.sales_id],
    references: [sales.id],
  }),
  entryPassCustomer: one(entryPassCustomers, {
    fields: [salesEntryPass.ep_customer_id],
    references: [entryPassCustomers.id],
  }),
}));
