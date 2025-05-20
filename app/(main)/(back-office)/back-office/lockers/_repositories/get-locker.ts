import { db } from "@/db";
import { lockers } from "@/db/schema";
import { Locker } from "@/types/locker";
import { eq } from "drizzle-orm";

export async function getLocker({
  lockerId,
}: {
  lockerId: string;
}): Promise<{ locker: Locker | null }> {
  const locker = await db.query.lockers.findFirst({
    where: eq(lockers.id, BigInt(lockerId)),
  });

  if (!locker)
    return {
      locker: null,
    };

  return {
    locker: locker,
  };
}
