import { db } from "@/db";
import { ipLocations } from "../schema";

export async function ipLocationSeeder() {
  const ipLocationList: (typeof ipLocations.$inferInsert)[] = [
    {
      ip_address: "127.0.0.1",
      location_desc: "Local Device",
    },
    {
      ip_address: "192.168.10.23",
      location_desc: "Device Test Dev",
    },
    {
      ip_address: "192.168.10.75",
      location_desc: "Device Test Dev - Edy",
    },
    {
      ip_address: "192.168.10.134",
      location_desc: "Device Test Dev - Yeri",
    },
    {
      ip_address: "192.168.10.33",
      location_desc: "Device Test Dev - Iwan",
    },
  ];

  await Promise.all(
    ipLocationList.map((ipLocation) =>
      db.insert(ipLocations).values(ipLocation).onDuplicateKeyUpdate({
        set: ipLocation,
      }),
    ),
  );
}
