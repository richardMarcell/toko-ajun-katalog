import { relations } from "drizzle-orm";
import {
  bigint,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { userHasRoles } from "./user-has-roles";
import { roleHasPermissions } from "./role-has-permissions";

export const roles = mysqlTable("roles", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  name: varchar("name", { length: 255 }).unique().notNull(),
  description: varchar("description", {length: 225}).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const roleRelations = relations(roles, ({ many }) => ({
  userHasRoles: many(userHasRoles),
  roleHasPermissions: many(roleHasPermissions),
}));
