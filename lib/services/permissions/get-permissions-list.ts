import { db } from "@/db";
import { Permission } from "@/types/permission";

type PermissionType = Pick<Permission, "id" | "group" | "name" | "description">;

export default async function getPermissionsList(): Promise<{
  permissionsList: Record<string, PermissionType[]>;
}> {
  const permissionsList = await db.query.permissions.findMany({
    columns: {
      id: true,
      group: true,
      name: true,
      description: true,
    },
  });

  const groupedPermissions = permissionsList.reduce<
    Record<string, PermissionType[]>
  >((acc, permission) => {
    const groupName = permission.group;
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(permission);
    return acc;
  }, {});

  const sortedGroupedPermissions = Object.fromEntries(
    Object.entries(groupedPermissions).sort(([a], [b]) => a.localeCompare(b)),
  );

  return { permissionsList: sortedGroupedPermissions };
}
