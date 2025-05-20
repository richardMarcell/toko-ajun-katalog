import { relations } from "drizzle-orm";
import {
  bigint,
  date,
  foreignKey,
  mysqlTable,
  timestamp,
} from "drizzle-orm/mysql-core";
import { entryPassCustomers } from "./entry-pass-customers";
import { products } from "./products";
import { sales } from "./sales";
import { users } from "./users";

export const entryPassCustomerHistories = mysqlTable(
  "entry_pass_customer_histories",
  {
    id: bigint("id", { mode: "bigint", unsigned: true })
      .primaryKey()
      .autoincrement(),
    sales_id: bigint("sales_id", {
      mode: "bigint",
      unsigned: true,
    }),
    ep_customer_id: bigint("ep_customer_id", {
      mode: "bigint",
      unsigned: true,
    }).notNull(), // relasi dengan table entry_pass_customers
    product_id: bigint("product_id", {
      mode: "bigint",
      unsigned: true,
    }).notNull(),
    created_by: bigint("created_by", {
      mode: "bigint",
      unsigned: true,
    }).notNull(),
    registered_at: date("registered_at").notNull(), // Tanggal pendaftaran entry pass oleh customer
    valid_until: date("valid_until").notNull(), // Tanggal valid entry pass dihitung dari tanggal pendaftaran
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.sales_id],
      foreignColumns: [sales.id],
      name: "fk_ep_customer_sales",
    }),
    foreignKey({
      columns: [table.ep_customer_id],
      foreignColumns: [entryPassCustomers.id],
      name: "fk_ep_customer_customer",
    }),
    foreignKey({
      columns: [table.product_id],
      foreignColumns: [products.id],
      name: "fk_ep_customer_product",
    }),
    foreignKey({
      columns: [table.created_by],
      foreignColumns: [users.id],
      name: "fk_ep_customer_user",
    }),
  ],
);

export const entryPassCustomerHistoriesRelations = relations(
  entryPassCustomerHistories,
  ({ one }) => ({
    user: one(users, {
      fields: [entryPassCustomerHistories.created_by],
      references: [users.id],
    }),
    product: one(products, {
      fields: [entryPassCustomerHistories.product_id],
      references: [products.id],
    }),
    entryPassCustomer: one(entryPassCustomers, {
      fields: [entryPassCustomerHistories.ep_customer_id],
      references: [entryPassCustomers.id],
    }),
  }),
);
