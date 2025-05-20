import {
  bigint,
  date,
  int,
  mysqlTable,
  timestamp,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { products } from "./products";
import { swimmingClassCustomers } from "./swimming-class-customers";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { sales } from "./sales";

export const swimmingClassCustomerHistories = mysqlTable(
  "swimming_class_customer_histories",
  {
    id: bigint("id", { mode: "bigint", unsigned: true })
      .primaryKey()
      .autoincrement(),
    sales_id: bigint("sales_id", {
      mode: "bigint",
      unsigned: true,
    }),
    sc_customer_id: bigint("sc_customer_id", {
      mode: "bigint",
      unsigned: true,
    }).notNull(), // relasi dengan table swimming_class_customers
    product_id: bigint("product_id", {
      mode: "bigint",
      unsigned: true,
    }).notNull(),
    created_by: bigint("created_by", {
      mode: "bigint",
      unsigned: true,
    }).notNull(),
    registered_at: date("registered_at").notNull(), // Tanggal pendaftaran kelas oleh customer
    valid_until: date("valid_until").notNull(), // Tanggal valid kelas renang dihitung dari tanggal pendaftaran
    valid_for: int("valid_for", { unsigned: true }), // Jumlah pertemuan dalam kelas yang dipilih customer
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.sales_id],
      foreignColumns: [sales.id],
      name: "fk_sch_sales",
    }),
    foreignKey({
      columns: [table.sc_customer_id],
      foreignColumns: [swimmingClassCustomers.id],
      name: "fk_sch_customer",
    }),
    foreignKey({
      columns: [table.product_id],
      foreignColumns: [products.id],
      name: "fk_sch_product",
    }),
    foreignKey({
      columns: [table.created_by],
      foreignColumns: [users.id],
      name: "fk_sch_user",
    }),
  ],
);

export const swimmingClassCustomerHistoriesRelations = relations(
  swimmingClassCustomerHistories,
  ({ one }) => ({
    user: one(users, {
      fields: [swimmingClassCustomerHistories.created_by],
      references: [users.id],
    }),
    product: one(products, {
      fields: [swimmingClassCustomerHistories.product_id],
      references: [products.id],
    }),
    swimmingClassCustomer: one(swimmingClassCustomers, {
      fields: [swimmingClassCustomerHistories.sc_customer_id],
      references: [swimmingClassCustomers.id],
    }),
  }),
);
