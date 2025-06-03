import { db } from "@/db";
import { permissions, roles, userHasRoles } from "@/db/schema";
import { roleHasPermissions } from "@/db/schema/role-has-permissions";
import { User } from "@/types/next-auth";
import { and, eq, inArray } from "drizzle-orm";
import { forbidden } from "next/navigation";

export async function can({
  permissionNames,
  user,
  isRedirectToForbiddenPage = true,
}: {
  permissionNames: string[];
  user: User | null;
  isRedirectToForbiddenPage?: boolean;
}): Promise<never | boolean> {
  if (!user) return false;

  const userRoleIds = await getUserRoleId({ userId: BigInt(user.id) });
  const isAuthorized = await getUserAuthorized({
    permissionNames,
    userRoleIds,
  });

  if (isRedirectToForbiddenPage) {
    if (!isAuthorized) return forbidden();
  }

  return isAuthorized;
}

async function getUserRoleId({
  userId,
}: {
  userId: bigint;
}): Promise<bigint[]> {
  const userRoles = await db
    .select({ role_id: userHasRoles.role_id })
    .from(userHasRoles)
    .where(eq(userHasRoles.user_id, userId));

  return userRoles.map((userRole) => userRole.role_id);
}

async function getUserAuthorized({
  permissionNames,
  userRoleIds,
}: {
  permissionNames: string[];
  userRoleIds: bigint[];
}): Promise<boolean> {
  // TODO: create mechanisme to store cookie to file, for server get user's data. To evade the user's client changed
  const userPermissions = await db
    .select({
      role_name: roles.name,
      permission_group: permissions.group,
      permission_name: permissions.name,
    })
    .from(roleHasPermissions)
    .leftJoin(roles, eq(roles.id, roleHasPermissions.role_id))
    .leftJoin(permissions, eq(permissions.id, roleHasPermissions.permission_id))
    .where(
      and(
        inArray(roleHasPermissions.role_id, userRoleIds),
        inArray(permissions.name, permissionNames),
      ),
    );

  return userPermissions.length > 0;
}
