"use server";

import { db } from "@/db";
import { ipLocationHasPermissions } from "@/db/schema/ip-location-has-permissions";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import PermissionDeniedError from "@/lib/exceptions/permission-denied-error";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function toggleUpdatePermission({
  ipLocationId,
  permissionId,
  checked,
}: {
  ipLocationId: bigint;
  permissionId: bigint;
  checked: boolean;
}): Promise<void> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const permissionNames = [PermissionEnum.BACK_OFFICE_IP_LOCATION_UPDATE];
    const isAuthorized = await can({
      permissionNames: permissionNames,
      user: user,
    });

    if (!isAuthorized)
      throw new PermissionDeniedError({
        userId: user.id,
        userName: user.name,
        deniedPermissions: permissionNames.toString(),
      });

    if (checked) {
      await db.insert(ipLocationHasPermissions).values({
        ip_location_id: ipLocationId,
        permission_id: permissionId,
      });
    } else {
      await db
        .delete(ipLocationHasPermissions)
        .where(
          and(
            eq(ipLocationHasPermissions.ip_location_id, ipLocationId),
            eq(ipLocationHasPermissions.permission_id, permissionId),
          ),
        );
    }
  } catch (error: any) {
    console.error(error);
  }
}
