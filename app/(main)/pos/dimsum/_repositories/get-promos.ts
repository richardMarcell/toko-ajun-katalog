import { db } from "@/db";
import { PromoTypeEnum } from "@/lib/enums/PromoTypeEnum";
import { getDateStartTime } from "@/lib/utils";
import { Promo } from "@/types/promo";

export async function getPromos(): Promise<{
  promos: Promo[];
}> {
  // NOTE: accept value '2025-04-29T00:00:00.000Z' 
  // variable today type Date can't string
  const today = getDateStartTime();

  const promos = await db.query.promos.findMany({
    where: (promos, { and, lte, gte, eq }) =>
      and(
        lte(promos.periode_start, today),
        gte(promos.periode_end, today),
        eq(promos.is_active, true),
        eq(promos.type, PromoTypeEnum.PERCENTAGE),
      ),
  });

  return {
    promos: promos,
  };
}
