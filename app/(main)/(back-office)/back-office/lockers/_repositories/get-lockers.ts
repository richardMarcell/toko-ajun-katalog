import { db } from "@/db";
import { lockers as lockerSchema } from "@/db/schema";
import { LockerStatusEnum } from "@/lib/enums/LockerStatusEnum";
import { LockerTypeEnum } from "@/lib/enums/LockerTypeEnum";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { Locker } from "@/types/locker";
import { and, count, eq } from "drizzle-orm";

export async function getLockers({
  searchParams,
}: {
  searchParams: BackOfficeSearchParams<{ type: string }>;
}): Promise<{ lockers: Locker[]; totalLockerAvailable: number; type: string }> {
  const type = searchParams.type ? searchParams.type : LockerTypeEnum.STANDARD;

  const lockers = await db.query.lockers.findMany({
    where: eq(lockerSchema.type, type),
  });

  const totalLockers = await db
    .select({
      count: count(),
    })
    .from(lockerSchema)
    .where(
      and(
        eq(lockerSchema.type, type),
        eq(lockerSchema.status, LockerStatusEnum.AVAILABLE),
      ),
    );
  const totalLockerAvailable = totalLockers[0].count;

  return {
    lockers,
    totalLockerAvailable,
    type,
  };
}
