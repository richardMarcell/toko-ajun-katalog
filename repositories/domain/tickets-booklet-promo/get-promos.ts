import { db } from "@/db";
import { getDateStartTime } from "@/lib/utils";
import { Promo } from "@/types/promo";

export async function getPromos(): Promise<{
  promos: Promo[];
}> {
  const today = getDateStartTime();

  const promos = await db.query.promos.findMany({
    where: (promos, { and, lte, gte, eq }) =>
      and(
        lte(promos.periode_start, today),
        gte(promos.periode_end, today),
        eq(promos.is_active, true),
      ),
  });

  return {
    promos: promos,
  };
}
