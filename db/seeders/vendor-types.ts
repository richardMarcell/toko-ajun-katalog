import { db } from "@/db";
import { vendorTypes } from "../schema";

export async function vendorTypeSeeder() {
  const data: (typeof vendorTypes.$inferInsert)[] = [
    {
      code: "TRAVELOKA",
      name: "Traveloka",
    },
    {
      code: "INDOMARET",
      name: "Indomaret",
    },
    {
      code: "GOERS",
      name: "Goers",
    },
  ];

  await Promise.all(
    data.map((dataItem) =>
      db.insert(vendorTypes).values(dataItem).onDuplicateKeyUpdate({
        set: dataItem,
      }),
    ),
  );
}
