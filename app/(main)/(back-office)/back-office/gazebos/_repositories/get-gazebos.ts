import { db } from "@/db";
import { gazebos as gazeboSchema } from "@/db/schema";
import { GazeboStatusEnum } from "@/lib/enums/GazeboStatusEnum";
import { GazeboTypeEnum } from "@/lib/enums/GazeboTypeEnum";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { Gazebo } from "@/types/gazebo";
import { and, count, eq } from "drizzle-orm";

export async function getGazebos({
  searchParams,
}: {
  searchParams: BackOfficeSearchParams<{ type: string }>;
}): Promise<{ gazebos: Gazebo[]; totalGazeboAvailable: number; type: string }> {
  const type = searchParams.type ? searchParams.type : GazeboTypeEnum.FAMILY;

  const gazebos = await db.query.gazebos.findMany({
    where: eq(gazeboSchema.type, type),
  });

  const totalGazebos = await db
    .select({
      count: count(),
    })
    .from(gazeboSchema)
    .where(
      and(
        eq(gazeboSchema.type, type),
        eq(gazeboSchema.status, GazeboStatusEnum.AVAILABLE),
      ),
    );
  const totalGazeboAvailable = totalGazebos[0].count;

  return {
    gazebos,
    totalGazeboAvailable,
    type,
  };
}
