import { bigint, mysqlTable } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { permissions } from "./permissions";
import { ipLocations } from "./ip-locations";

export const ipLocationHasPermissions = mysqlTable(
  "ip_location_has_permissions",
  {
    permission_id: bigint("permission_id", { mode: "bigint", unsigned: true })
      .notNull()
      .references(() => permissions.id, { onDelete: "restrict" }),
    ip_location_id: bigint("ip_location_id", { mode: "bigint", unsigned: true })
      .notNull()
      .references(() => ipLocations.id, { onDelete: "restrict" }),
  },
);

export const ipLocationHasPermissionRelations = relations(
  ipLocationHasPermissions,
  ({ one }) => ({
    permission: one(permissions, {
      fields: [ipLocationHasPermissions.permission_id],
      references: [permissions.id],
    }),
    ipLocation: one(ipLocations, {
      fields: [ipLocationHasPermissions.ip_location_id],
      references: [ipLocations.id],
    }),
  }),
);
