import bcrypt from "bcrypt";
import { db } from "@/db";
import { assignRole } from "@/lib/services/permissions/assign-role";
import { RoleEnum } from "./datas/default-roles";
import { users } from "../schema";

export async function userSeeder() {
  await createUser({
    name: "Owner",
    username: "owner",
    email: "owner@tokoajun.app",
    role: RoleEnum.OWNER,
  });

  await createUser({
    name: "Customer",
    username: "customer",
    email: "customer@tokoajun.app",
    role: RoleEnum.CUSTOMER,
  });
}

async function createUser({
  name,
  username,
  email,
  role,
}: {
  name: string;
  username: string;
  email: string;
  role: RoleEnum;
}) {
  const password = await bcrypt.hash("password", 10);

  const insertedUsers = await db
    .insert(users)
    .values({
      name: name,
      username: username,
      email: email,
      password: password,
    })
    .onDuplicateKeyUpdate({
      set: {
        name: name,
        password: password,
        email: email,
      },
    })
    .$returningId();

  assignRole({ userId: insertedUsers[0].id, roleNames: [role] });
}
