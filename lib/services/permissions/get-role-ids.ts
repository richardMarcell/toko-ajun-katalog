import { db } from "@/db";

export async function getRoleIds({
  roleNames,
}: {
  roleNames: string[];
}): Promise<bigint[] | null> {
  const role = await db.query.roles.findMany({
    columns: { id: true },
    where: (roles, { inArray }) => inArray(roles.name, roleNames),
  });

  if (!role) return null;

  return role.map((role) => role.id);
}
