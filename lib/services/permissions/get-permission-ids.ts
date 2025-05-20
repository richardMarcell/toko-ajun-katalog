import { db } from "@/db";

export async function getPermissionIds({
  permissionNames,
}: {
  permissionNames: string[];
}): Promise<bigint[] | null> {
  const permissions = await db.query.permissions.findMany({
    columns: { id: true },
    where: (permissions, { inArray }) =>
      inArray(permissions.name, permissionNames),
  });

  if (!permissions) return null;

  return permissions.map((permission) => permission.id);
}
