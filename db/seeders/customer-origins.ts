import { db } from "@/db";
import { customerOrigins } from "../schema";

export async function customerOriginSeeder() {
  const customerOriginList: (typeof customerOrigins.$inferInsert)[] = [
    {
      id: BigInt(1),
      name: "Kubu Raya",
    },
    {
      id: BigInt(2),
      name: "Pontianak",
    },
  ];

  await Promise.all(
    customerOriginList.map((customerOrigin) =>
      db.insert(customerOrigins).values(customerOrigin).onDuplicateKeyUpdate({
        set: customerOrigin,
      }),
    ),
  );
}
