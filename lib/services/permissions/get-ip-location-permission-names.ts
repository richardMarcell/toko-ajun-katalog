"use server";
import { db } from "@/db";
import { ipLocations, permissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import getClientIp from "../auth/get-client-ip";
import { ipLocationHasPermissions } from "@/db/schema/ip-location-has-permissions";

export async function getIpLocationPermissionNames(): Promise<
  (string | null)[]
> {
  const ipAddress = await getClientIp();

  const ipLocationPermissionList = await db
    .select({ permission: permissions.name })
    .from(ipLocations)
    .leftJoin(
      ipLocationHasPermissions,
      eq(ipLocationHasPermissions.ip_location_id, ipLocations.id),
    )
    .leftJoin(
      permissions,
      eq(ipLocationHasPermissions.permission_id, permissions.id),
    )
    .where(eq(ipLocations.ip_address, ipAddress));

  return ipLocationPermissionList.map(
    (ipLocationPermission) => ipLocationPermission.permission,
  );
}
