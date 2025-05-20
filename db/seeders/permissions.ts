import { db } from "@/db";
import { permissions } from "../schema";
import { sql } from "drizzle-orm";
import { generatePermissionList } from "@/lib/enums/PermissionEnum";

export async function permissionSeeder() {
  const permissionList = generatePermissionList();

  await db
    .insert(permissions)
    .values(permissionList)
    .onDuplicateKeyUpdate({
      set: {
        group: sql`values(${permissions.group})`,
        description: sql`values(${permissions.description})`,
      },
    });
}
