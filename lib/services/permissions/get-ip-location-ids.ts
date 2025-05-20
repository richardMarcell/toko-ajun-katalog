import { db } from "@/db";

export async function getIpLocationIds({
  ipAddress,
}: {
  ipAddress: string[];
}): Promise<bigint[] | null> {
  const ipLocations = await db.query.ipLocations.findMany({
    columns: { id: true },
    where: (ipLocations, { inArray }) =>
      inArray(ipLocations.ip_address, ipAddress),
  });

  if (ipLocations.length === 0) return null;

  return ipLocations.map((ipLocation) => ipLocation.id);
}
