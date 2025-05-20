import { bigint, mysqlTable } from "drizzle-orm/mysql-core";
import { roles } from "./roles";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const userHasRoles = mysqlTable("user_has_roles", {
  role_id: bigint("role_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => roles.id, { onDelete: "restrict" }),
  user_id: bigint("user_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
});

export const userHasRoleRelations = relations(userHasRoles, ({ one }) => ({
  role: one(roles, {
    fields: [userHasRoles.role_id],
    references: [roles.id],
  }),
  user: one(users, {
    fields: [userHasRoles.user_id],
    references: [users.id],
  }),
}));
