import { db } from "@/db";
import { wristbands } from "../schema";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";

export async function wristbandSeeder() {
  const existing = await db.query.wristbands.findMany();

  if (existing.length > 0) {
    console.log("Wristband seeder skipped: data already exists");
    return;
  }

  const data: (typeof wristbands.$inferInsert)[] = [
    {
      code: "111",
      status: WristbandStatusEnum.AVAILABLE,
    },
    {
      code: "222",
      status: WristbandStatusEnum.AVAILABLE,
    },
    {
      code: "333",
      status: WristbandStatusEnum.AVAILABLE,
    },
    {
      code: "444",
      status: WristbandStatusEnum.AVAILABLE,
    },
    {
      code: "555",
      status: WristbandStatusEnum.AVAILABLE,
    },
  ];

  await Promise.all(
    data.map((dataItem) =>
      db.insert(wristbands).values(dataItem).onDuplicateKeyUpdate({
        set: dataItem,
      }),
    ),
  );
}
