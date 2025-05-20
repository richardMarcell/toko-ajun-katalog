import { db } from "@/db";
import { sql } from "drizzle-orm";
import { generatePermissionList } from "@/lib/enums/PermissionEnum";
import { permissions } from "../schema";

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
