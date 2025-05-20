"use server";

import { db } from "@/db";
import { roleHasPermissions } from "@/db/schema/role-has-permissions";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import PermissionDeniedError from "@/lib/exceptions/permission-denied-error";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function toggleUpdatePermission({
  roleId,
  permissionId,
  checked,
}: {
  roleId: bigint;
  permissionId: bigint;
  checked: boolean;
}): Promise<void> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const permissionNames = [PermissionEnum.BACK_OFFICE_ROLE_UPDATE];
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
      await db.insert(roleHasPermissions).values({
        role_id: roleId,
        permission_id: permissionId,
      });
    } else {
      await db
        .delete(roleHasPermissions)
        .where(
          and(
            eq(roleHasPermissions.role_id, roleId),
            eq(roleHasPermissions.permission_id, permissionId),
          ),
        );
    }
  } catch (error: any) {
    console.error(error);
  }
}
