import {
  bigint,
  json,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const salesTemporary = mysqlTable(
  "sales_temporary",
  {
    id: bigint("id", { mode: "bigint", unsigned: true })
      .primaryKey()
      .autoincrement(),
    user_id: bigint("user_id", { mode: "bigint", unsigned: true })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    unit_business: varchar("unit_business", { length: 255 }).notNull(),
    value: json("value").notNull(), // Menyinpan informasi penjualan dan detail penjualan
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    unique_user_unit_business: uniqueIndex("unique_user_unit_business").on(
      table.user_id,
      table.unit_business,
    ),
  }),
);

export const salesTemporaryRelations = relations(salesTemporary, ({ one }) => ({
  user: one(users, {
    fields: [salesTemporary.user_id],
    references: [users.id],
  }),
}));
