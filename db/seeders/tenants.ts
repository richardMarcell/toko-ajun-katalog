import { db } from "@/db";
import { tenants } from "../schema";

export async function tenantSeeder() {
  const data = [
    {
      id: BigInt(1),
      name: "Katsuya",
      image: "/storage/pos/food-corner/tenant.webp",
      ip_address: "127.0.0.1",
    },
    {
      id: BigInt(2),
      name: "Nasi Goreng Station",
      image: "/storage/pos/food-corner/tenant.webp",
      ip_address: "127.0.0.1",
    },
    {
      id: BigInt(3),
      name: "Qubu",
      image: "/storage/pos/food-corner/tenant.webp",
      ip_address: "127.0.0.1",
    },
  ];

  await Promise.all(
    data.map((dataItem) =>
      db.insert(tenants).values(dataItem).onDuplicateKeyUpdate({
        set: dataItem,
      }),
    ),
  );
}
