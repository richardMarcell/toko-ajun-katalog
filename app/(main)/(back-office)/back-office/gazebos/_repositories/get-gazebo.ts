import { db } from "@/db";
import { gazebos } from "@/db/schema";
import { Gazebo } from "@/types/gazebo";
import { eq } from "drizzle-orm";

export async function getGazebo({
  gazeboId,
}: {
  gazeboId: string;
}): Promise<{ gazebo: Gazebo | null }> {
  const gazebo = await db.query.gazebos.findFirst({
    where: eq(gazebos.id, BigInt(gazeboId)),
  });

  if (!gazebo)
    return {
      gazebo: null,
    };

  return {
    gazebo: gazebo,
  };
}
