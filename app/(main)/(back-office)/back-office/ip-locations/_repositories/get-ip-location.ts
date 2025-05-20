import { db } from "@/db";
import { ipLocationHasPermissions, ipLocations } from "@/db/schema";
import { IpLocation } from "@/types/ip-location";
import { Permission } from "@/types/permission";
import { User } from "@/types/user";
import { eq } from "drizzle-orm";

export type IpLocationIncludeRelationship = IpLocation & {
  currentLoggedInUser: User | null;
  permissions?: Permission[];
};

export async function getIpLocation({
  ipLocationId,
}: {
  ipLocationId: bigint;
}): Promise<{ ipLocation: IpLocationIncludeRelationship | null }> {
  const ipLocation = await db.query.ipLocations.findFirst({
    where: eq(ipLocations.id, ipLocationId),
    with: {
      currentLoggedInUser: true,
    },
  });

  if (!ipLocation)
    return {
      ipLocation: null,
    };

  const ipLocationHasPermissionsList =
    await db.query.ipLocationHasPermissions.findMany({
      where: eq(ipLocationHasPermissions.ip_location_id, ipLocationId),
      with: {
        permission: true,
      },
    });

  const permissions = ipLocationHasPermissionsList.map(
    (entry) => entry.permission,
  );

  return {
    ipLocation: {
      ...ipLocation,
      permissions,
    } as IpLocationIncludeRelationship,
  };
}
