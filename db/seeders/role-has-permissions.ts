import { db } from "@/db";
import { sql } from "drizzle-orm";
import { getPermissionIds } from "@/lib/services/permissions/get-permission-ids";
import { getRoleIds } from "@/lib/services/permissions/get-role-ids";
import defaultRoles from "./datas/default-roles";
import { roleHasPermissions } from "../schema";

export async function roleHasPermissionSeeder(): Promise<void> {
  // NOTE: empty the table before seeding
  await db.execute(sql`TRUNCATE TABLE role_has_permissions`);

  const roleHasPermissionList = getRoleHasPermissionList();

  await Promise.all(
    roleHasPermissionList.map(async (roleHasPermission) => {
      const roleIds = await getRoleIds({
        roleNames: [roleHasPermission.roleName],
      });
      const permissionIds = await getPermissionIds({
        permissionNames: roleHasPermission.permissionNames,
      });

      if (roleIds === null || permissionIds === null) return;

      const insertPromises = permissionIds.map(async (permissionId) => {
        return db
          .insert(roleHasPermissions)
          .values({
            role_id: roleIds[0],
            permission_id: permissionId,
          })
          .onDuplicateKeyUpdate({
            set: {
              role_id: sql`values(${roleHasPermissions.role_id})`,
              permission_id: sql`values(${roleHasPermissions.permission_id})`,
            },
          });
      });

      await Promise.all(insertPromises);
    }),
  );
}

function getRoleHasPermissionList(): Array<{
  roleName: string;
  permissionNames: string[];
}> {
  return defaultRoles.map((role) => {
    return {
      roleName: role.name,
      permissionNames: role.permissions,
    };
  });
}
