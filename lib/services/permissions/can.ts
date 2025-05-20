import { db } from "@/db";
import { ipLocations, permissions, roles, userHasRoles } from "@/db/schema";
import { roleHasPermissions } from "@/db/schema/role-has-permissions";
import { User } from "@/types/next-auth";
import { and, eq, inArray } from "drizzle-orm";
import { forbidden } from "next/navigation";
import getClientIp from "../auth/get-client-ip";
import { ipLocationHasPermissions } from "@/db/schema/ip-location-has-permissions";

export async function can({
  permissionNames,
  user,
  isRedirectToForbiddenPage = true,
}: {
  permissionNames: string[];
  user: User;
  isRedirectToForbiddenPage?: boolean;
}): Promise<never | boolean> {
  const userRoleIds = await getUserRoleId({ userId: BigInt(user.id) });
  const isAuthorized = await getUserAuthorized({
    permissionNames,
    userRoleIds,
  });

  const ipAddress = await getClientIp();
  const ipLocationIds = await getIpLocationId({ ipAddress });

  const isIpLocationAuthorized = await getIpLocationAuthorized({
    permissionNames,
    ipLocationIds,
  });

  if (isRedirectToForbiddenPage) {
    if (!isAuthorized || !isIpLocationAuthorized) return forbidden();
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

async function getIpLocationId({
  ipAddress,
}: {
  ipAddress: string;
}): Promise<bigint[]> {
  const ipLocationsList = await db
    .select({ id: ipLocations.id })
    .from(ipLocations)
    .where(eq(ipLocations.ip_address, ipAddress));

  return ipLocationsList.map((ipLocation) => ipLocation.id);
}

async function getIpLocationAuthorized({
  permissionNames,
  ipLocationIds,
}: {
  permissionNames: string[];
  ipLocationIds: bigint[];
}): Promise<boolean> {
  const ipLocationPermissions = await db
    .select({
      ip_address: ipLocations.ip_address,
      permission_group: permissions.group,
      permission_name: permissions.name,
    })
    .from(ipLocationHasPermissions)
    .leftJoin(
      ipLocations,
      eq(ipLocations.id, ipLocationHasPermissions.ip_location_id),
    )
    .leftJoin(
      permissions,
      eq(permissions.id, ipLocationHasPermissions.permission_id),
    )
    .where(
      and(
        inArray(ipLocationHasPermissions.ip_location_id, ipLocationIds),
        inArray(permissions.name, permissionNames),
      ),
    );

  return ipLocationPermissions.length > 0;
}
