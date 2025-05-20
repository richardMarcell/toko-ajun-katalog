import { db } from "@/db";
import { roleHasPermissions, roles } from "@/db/schema";
import { Permission } from "@/types/permission";
import { Role } from "@/types/role";
import { eq } from "drizzle-orm";

export type roleIncludeRelationship = Role & {
  permissions: Permission[];
};

export default async function getRole({
  roleId,
}: {
  roleId: string;
}): Promise<{ role: roleIncludeRelationship | null }> {
  const role = await db.query.roles.findFirst({
    where: eq(roles.id, BigInt(roleId)),
  });

  if (!role)
    return {
      role: null,
    };

  const roleHasPermissionsList = await db.query.roleHasPermissions.findMany({
    where: eq(roleHasPermissions.role_id, BigInt(roleId)),
    with: {
      permission: true,
    },
  });

  const permissions = roleHasPermissionsList.map((entry) => entry.permission);

  return {
    role: {
      ...role,
      permissions,
    } as roleIncludeRelationship,
  };
}
