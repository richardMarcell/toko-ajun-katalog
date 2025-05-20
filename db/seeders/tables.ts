import { db } from "@/db";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { tables } from "../schema";

export async function tableSeeder() {
  const data: (typeof tables.$inferInsert)[] = [
    {
      id: BigInt(1),
      name: "001",
      unit_business: UnitBusinessSateliteQubuEnum.RESTO_PATIO,
    },
    {
      id: BigInt(2),
      name: "002",
      unit_business: UnitBusinessSateliteQubuEnum.RESTO_PATIO,
    },
    {
      id: BigInt(3),
      name: "003",
      unit_business: UnitBusinessSateliteQubuEnum.RESTO_PATIO,
    },
    {
      id: BigInt(4),
      name: "004",
      unit_business: UnitBusinessSateliteQubuEnum.RESTO_PATIO,
    },
    {
      id: BigInt(5),
      name: "001",
      unit_business: UnitBusinessSateliteQubuEnum.DIMSUM,
    },
    {
      id: BigInt(6),
      name: "002",
      unit_business: UnitBusinessSateliteQubuEnum.DIMSUM,
    },
    {
      id: BigInt(7),
      name: "003",
      unit_business: UnitBusinessSateliteQubuEnum.DIMSUM,
    },
    {
      id: BigInt(8),
      name: "004",
      unit_business: UnitBusinessSateliteQubuEnum.DIMSUM,
    },
  ];

  await Promise.all(
    data.map((dataItem) =>
      db.insert(tables).values(dataItem).onDuplicateKeyUpdate({
        set: dataItem,
      }),
    ),
  );
}
