import { db } from "@/db";
import { assignRole } from "@/lib/services/permissions/assign-role";
import bcrypt from "bcrypt";
import { users } from "../schema";
import { RoleEnum } from "./datas/default-roles";

type User = {
  name: string;
  username: string;
  email: string;
  roles: RoleEnum[];
};

export async function existingUserSeeder() {
  const users: User[] = [
    {
      name: "Ahmad Fauzi",
      username: "AHMAD",
      email: "ahmad@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Aqmal",
      username: "AQMAL",
      email: "aqmal@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Arif",
      username: "ARIF",
      email: "arif@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Budi Harianto",
      username: "BUDI",
      email: "budi@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Faisal",
      username: "FAISAL",
      email: "faisal@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Indra",
      username: "INDRA",
      email: "indra@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Novi Lestari",
      username: "NOVI",
      email: "novi@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Andre",
      username: "ANDRE",
      email: "andre@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Aswadi",
      username: "ASWADI",
      email: "aswadi@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Dito",
      username: "DITO",
      email: "dito@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Fiena",
      username: "FIENA",
      email: "fiena@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Tari",
      username: "TARI",
      email: "tari@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Filomina Jane",
      username: "FILOM",
      email: "filom@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Christina",
      username: "CHRISTINA",
      email: "christina@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Gabriela Elly Susanti",
      username: "ELLY",
      email: "elly@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Trifonia Yusta Ermika",
      username: "MIKA",
      email: "mika@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Stephanus Wahyu Agusto",
      username: "GUSTO",
      email: "gusto@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Evi Novianti",
      username: "EVI",
      email: "evi@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Febriani",
      username: "FEBRI",
      email: "febri@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Winda Desipora Natari",
      username: "WINDA",
      email: "winda@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Grabella",
      username: "BELLA",
      email: "bella@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Siti Hatizah",
      username: "SITI",
      email: "siti@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Mutiara Amelia Putri",
      username: "TIARA",
      email: "tiara@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Monika Permata Shinta",
      username: "MONIKA",
      email: "monika@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Muhammad Amir Dhaifallah",
      username: "AMIR",
      email: "amir@satelite.app",
      roles: [
        RoleEnum.DIMSUM_CASHIER,
        RoleEnum.FC_CASHIER,
        RoleEnum.LOCKER_CASHIER,
        RoleEnum.REFUND_CASHIER,
        RoleEnum.SOUVENIR_CASHIER,
        RoleEnum.TICKET_CASHIER,
      ],
    },
    {
      name: "Benevola Melania",
      username: "BENEVOLA",
      email: "benevola@satelite.app",
      roles: [
        RoleEnum.DIMSUM_CASHIER,
        RoleEnum.FC_CASHIER,
        RoleEnum.LOCKER_CASHIER,
        RoleEnum.REFUND_CASHIER,
        RoleEnum.SOUVENIR_CASHIER,
        RoleEnum.TICKET_CASHIER,
      ],
    },
    {
      name: "Kartika",
      username: "TIKA",
      email: "tika@satelite.app",
      roles: [
        RoleEnum.DIMSUM_CASHIER,
        RoleEnum.FC_CASHIER,
        RoleEnum.LOCKER_CASHIER,
        RoleEnum.REFUND_CASHIER,
        RoleEnum.SOUVENIR_CASHIER,
        RoleEnum.TICKET_CASHIER,
      ],
    },
    {
      name: "Maya Lestari",
      username: "MAYA",
      email: "maya@satelite.app",
      roles: [
        RoleEnum.DIMSUM_CASHIER,
        RoleEnum.FC_CASHIER,
        RoleEnum.LOCKER_CASHIER,
        RoleEnum.REFUND_CASHIER,
        RoleEnum.SOUVENIR_CASHIER,
        RoleEnum.TICKET_CASHIER,
      ],
    },
    {
      name: "Meri",
      username: "MERI",
      email: "meri@satelite.app",
      roles: [
        RoleEnum.DIMSUM_CASHIER,
        RoleEnum.FC_CASHIER,
        RoleEnum.LOCKER_CASHIER,
        RoleEnum.REFUND_CASHIER,
        RoleEnum.SOUVENIR_CASHIER,
        RoleEnum.TICKET_CASHIER,
      ],
    },
    {
      name: "Varisi Galih",
      username: "VARIS",
      email: "varis@satelite.app",
      roles: [
        RoleEnum.DIMSUM_CASHIER,
        RoleEnum.FC_CASHIER,
        RoleEnum.LOCKER_CASHIER,
        RoleEnum.REFUND_CASHIER,
        RoleEnum.SOUVENIR_CASHIER,
        RoleEnum.TICKET_CASHIER,
      ],
    },
    {
      name: "Septy Ambarwaty",
      username: "AMBAR",
      email: "ambar@satelite.app",
      roles: [
        RoleEnum.DIMSUM_CASHIER,
        RoleEnum.FC_CASHIER,
        RoleEnum.LOCKER_CASHIER,
        RoleEnum.REFUND_CASHIER,
        RoleEnum.SOUVENIR_CASHIER,
        RoleEnum.TICKET_CASHIER,
      ],
    },
    {
      name: "Juliantoro",
      username: "TORO",
      email: "toro@satelite.app",
      roles: [
        RoleEnum.DIMSUM_CASHIER,
        RoleEnum.FC_CASHIER,
        RoleEnum.LOCKER_CASHIER,
        RoleEnum.REFUND_CASHIER,
        RoleEnum.SOUVENIR_CASHIER,
        RoleEnum.TICKET_CASHIER,
      ],
    },
    {
      name: "Merry Natalia",
      username: "NATALIA",
      email: "natalia@satelite.app",
      roles: [
        RoleEnum.DIMSUM_CASHIER,
        RoleEnum.FC_CASHIER,
        RoleEnum.LOCKER_CASHIER,
        RoleEnum.REFUND_CASHIER,
        RoleEnum.SOUVENIR_CASHIER,
        RoleEnum.TICKET_CASHIER,
      ],
    },
    {
      name: "Kori Despa",
      username: "KORI",
      email: "kori@satelite.app",
      roles: [RoleEnum.PATIO_CASHIER],
    },
    {
      name: "Rani Safitri",
      username: "RANI",
      email: "rani@satelite.app",
      roles: [RoleEnum.PATIO_CASHIER],
    },
    {
      name: "Rizky Abimanyu",
      username: "ABI",
      email: "abi@satelite.app",
      roles: [RoleEnum.PATIO_CASHIER],
    },
    {
      name: "Taufik Hidayat",
      username: "TAUFIK",
      email: "taufik@satelite.app",
      roles: [RoleEnum.PATIO_CASHIER],
    },
    {
      name: "Uray Henny Novita",
      username: "HENNY",
      email: "henny@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Syf. Riana Agustina",
      username: "RIRI",
      email: "riri@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Intan Apriliana Putri",
      username: "INTAN",
      email: "intan@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Benedikta Meri",
      username: "MERI",
      email: "meri@satelite.app",
      roles: [RoleEnum.NON_ROLE],
    },
    {
      name: "Muhammad Rabuansyah",
      username: "IWAN",
      email: "iwan@satelite.app",
      roles: [RoleEnum.ADMIN],
    },
    {
      name: "Primus Nathaniel",
      username: "PRIMUS",
      email: "primus@satelite.app",
      roles: [RoleEnum.ADMIN],
    },
    {
      name: "Uray Henny Novita",
      username: "HENNY",
      email: "henny@satelite.app",
      roles: [RoleEnum.ADMIN],
    },
  ];

  for (const user of users) {
    await createUser(user);
  }
}

async function createUser({ name, username, email, roles }: User) {
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

  assignRole({ userId: insertedUsers[0].id, roleNames: roles });
}
