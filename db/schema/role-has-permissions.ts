import { bigint, mysqlTable } from "drizzle-orm/mysql-core";
import { roles } from "./roles";
import { relations } from "drizzle-orm";
import { permissions } from "./permissions";

export const roleHasPermissions = mysqlTable("role_has_permissions", {
  permission_id: bigint("permission_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => permissions.id, { onDelete: "restrict" }),
  role_id: bigint("role_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => roles.id, { onDelete: "restrict" }),
});

export const roleHasPermissionRelations = relations(
  roleHasPermissions,
  ({ one }) => ({
    permission: one(permissions, {
      fields: [roleHasPermissions.permission_id],
      references: [permissions.id],
    }),
    role: one(roles, {
      fields: [roleHasPermissions.role_id],
      references: [roles.id],
    }),
  }),
);
