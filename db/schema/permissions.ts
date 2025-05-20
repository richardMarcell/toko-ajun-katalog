import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { roleHasPermissions } from "./role-has-permissions";

export const permissions = mysqlTable("permissions", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  name: varchar("name", { length: 255 }).unique().notNull(),
  group: varchar("group", { length: 255 }).notNull(),
  description: varchar("description", { length: 225 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const permissionRelations = relations(permissions, ({ many }) => ({
  roleHasPermissions: many(roleHasPermissions),
}));
