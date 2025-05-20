import { db } from "@/db";
import { rooms } from "../schema/rooms";

export async function roomSeeder() {
  const data: (typeof rooms.$inferInsert)[] = [
    {
      id: BigInt(1),
      name: "101",
    },
    {
      id: BigInt(2),
      name: "102",
    },
    {
      id: BigInt(3),
      name: "103",
    },
    {
      id: BigInt(4),
      name: "104",
    },
    {
      id: BigInt(5),
      name: "105",
    },
  ];

  await Promise.all(
    data.map((dataItem) =>
      db.insert(rooms).values(dataItem).onDuplicateKeyUpdate({
        set: dataItem,
      }),
    ),
  );
}
