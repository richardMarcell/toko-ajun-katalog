import { db } from "@/db";
import { roles } from "../schema";
import { sql } from "drizzle-orm";
import defaultRoles from "./datas/default-roles";

export async function roleSeeder() {
  const roleList: {
    name: string;
    description: string;
  }[] = defaultRoles;

  await db
    .insert(roles)
    .values(roleList)
    .onDuplicateKeyUpdate({
      set: {
        description: sql`values(${roles.description})`,
      },
    });
}
