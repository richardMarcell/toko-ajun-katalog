"use server";
import { db } from "@/db";
import { permissions, userHasRoles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { roleHasPermissions } from "@/db/schema/role-has-permissions";
import { getUserAuthenticated } from "../auth/get-user-authenticated";
import { redirect } from "next/navigation";

export async function getUserPermissionNames(): Promise<(string | null)[]> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  const userPermissionList = await db
    .select({ permission: permissions.name })
    .from(userHasRoles)
    .leftJoin(
      roleHasPermissions,
      eq(roleHasPermissions.role_id, userHasRoles.role_id),
    )
    .leftJoin(permissions, eq(roleHasPermissions.permission_id, permissions.id))
    .where(eq(userHasRoles.user_id, BigInt(user.id)));

  return userPermissionList.map((userPermission) => userPermission.permission);
}
