import { db } from "@/db";
import { getRoleIds } from "./get-role-ids";
import { userHasRoles } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function assignRole({
  userId,
  roleNames,
}: {
  userId: bigint;
  roleNames: string[];
}): Promise<void> {
  const roleIds = await getRoleIds({ roleNames: roleNames });

  if (roleIds === null) return;

  const insertPromises = roleIds.map(async (roleId) => {
    return db
      .insert(userHasRoles)
      .values({
        user_id: userId,
        role_id: roleId,
      })
      .onDuplicateKeyUpdate({
        set: {
          user_id: sql`values(${userHasRoles.user_id})`,
          role_id: sql`values(${userHasRoles.role_id})`,
        },
      });
  });
  await Promise.all(insertPromises);

  return;
}
