import bcrypt from "bcrypt";
import { db } from "@/db";
import { users } from "../schema";
import { assignRole } from "@/lib/services/permissions/assign-role";
import { RoleEnum } from "./datas/default-roles";

export async function userSeeder() {
  // create super admin
  await createUser({
    name: "Super Admin",
    username: "superadmin",
    email: "superadmin@satelite.app",
    role: RoleEnum.SUPER_ADMIN,
  });

  // create admin
  await createUser({
    name: "Admin",
    username: "admin",
    email: "admin@satelite.app",
    role: RoleEnum.ADMIN,
  });

  // create food corner cashier
  await createUser({
    name: "Food Corner Cashier",
    username: "fc-cashier",
    email: "fc-cashier@satellite.app",
    role: RoleEnum.FC_CASHIER,
  });

  await createUser({
    name: "Food Corner Tenant",
    username: "fc-tenant",
    email: "fc-tenant@satellite.app",
    role: RoleEnum.FC_TENANT,
  });

  await createUser({
    name: "Ticket - Cashier",
    username: "ticket-cashier",
    email: "ticket-cashier@satellite.app",
    role: RoleEnum.TICKET_CASHIER,
  });

  await createUser({
    name: "Refund - Cashier",
    username: "refund-cashier",
    email: "refund-cashier@satellite.app",
    role: RoleEnum.REFUND_CASHIER,
  });

  await createUser({
    name: "Souvenir - Cashier",
    username: "souvenir-cashier",
    email: "souvenir-cashier@satellite.app",
    role: RoleEnum.SOUVENIR_CASHIER,
  });

  await createUser({
    name: "Locker - Cashier",
    username: "locker-cashier",
    email: "locker-cashier@satellite.app",
    role: RoleEnum.LOCKER_CASHIER,
  });

  await createUser({
    name: "Dimsum - Cashier",
    username: "dimsum-cashier",
    email: "dimsum-cashier@satellite.app",
    role: RoleEnum.DIMSUM_CASHIER,
  });

  await createUser({
    name: "Patio - Cashier",
    username: "patio-cashier",
    email: "patio-cashier@satellite.app",
    role: RoleEnum.PATIO_CASHIER,
  });

  await createUser({
    name: "External - Tenant",
    username: "external-tenant",
    email: "external-tenant@satelite.app",
    role: RoleEnum.FC_TENANT,
  })
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
