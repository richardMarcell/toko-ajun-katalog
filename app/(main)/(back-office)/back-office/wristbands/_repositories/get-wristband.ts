import { db } from "@/db";
import { wristbands } from "@/db/schema";
import { Wristband } from "@/types/wristband";
import { eq } from "drizzle-orm";

export async function getWristband({
  wristbandCode,
}: {
  wristbandCode: string;
}): Promise<{ wristband: Wristband | null }> {
  const wristband = await db.query.wristbands.findFirst({
    where: eq(wristbands.code, wristbandCode),
  });

  if (!wristband)
    return {
      wristband: null,
    };

  return {
    wristband: wristband,
  };
}
