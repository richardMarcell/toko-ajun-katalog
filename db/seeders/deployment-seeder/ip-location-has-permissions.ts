import { db } from "@/db";
import { getPermissionIds } from "@/lib/services/permissions/get-permission-ids";
import { getIpLocationIds } from "@/lib/services/permissions/get-ip-location-ids";
import { sql } from "drizzle-orm";
import { ipLocationHasPermissions } from "@/db/schema";
import defaultIpLocationsDeployment from "../datas/default-ip-locations-deployment";

export async function ipLocationHasPermissionSeeder(): Promise<void> {
  // NOTE: empty the table before seeding
  await db.execute(sql`TRUNCATE TABLE ip_location_has_permissions`);

  const ipLocationHasPermissionList = getIpLocationHasPermissionList();

  await Promise.all(
    ipLocationHasPermissionList.map(async (ipLocationHasPermission) => {
      const ipLocationIds = await getIpLocationIds({
        ipAddress: [ipLocationHasPermission.ipAddress],
      });
      const permissionIds = await getPermissionIds({
        permissionNames: ipLocationHasPermission.permissionNames,
      });

      if (ipLocationIds === null || permissionIds === null) return;

      const insertPromises = permissionIds.map((permissionId) =>
        db.insert(ipLocationHasPermissions).values({
          ip_location_id: ipLocationIds[0],
          permission_id: permissionId,
        }),
      );

      await Promise.all(insertPromises);
    }),
  );
}

function getIpLocationHasPermissionList(): Array<{
  ipAddress: string;
  permissionNames: string[];
}> {
  return defaultIpLocationsDeployment.map((ipLocation) => {
    return {
      ipAddress: ipLocation.ip_address,
      permissionNames: ipLocation.permissions,
    };
  });
}
