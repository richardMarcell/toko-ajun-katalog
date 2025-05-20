import { db } from "@/db";
import { ipLocations } from "@/db/schema";
import defaultIpLocationsDeployment from "../datas/default-ip-locations-deployment";

export async function ipLocationSeeder() {
  const ipLocationList: (typeof ipLocations.$inferInsert)[] =
    defaultIpLocationsDeployment.map((item) => ({
      ip_address: item.ip_address,
      location_desc: item.pos,
    }));

  await Promise.all(
    ipLocationList.map((ipLocation) =>
      db.insert(ipLocations).values(ipLocation).onDuplicateKeyUpdate({
        set: ipLocation,
      }),
    ),
  );
}
