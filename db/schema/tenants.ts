import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { products } from "./products";

export const tenants = mysqlTable("tenants", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  name: varchar("nama", { length: 255 }).notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  ip_address: varchar("ip_address", { length: 255 }).notNull(),
  is_required_tax: boolean("is_required_tax").default(true).notNull(), // tampilan apakah suatu tenant dikenai pajak
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const tenantsRelations = relations(tenants, ({ many }) => ({
  products: many(products),
}));
