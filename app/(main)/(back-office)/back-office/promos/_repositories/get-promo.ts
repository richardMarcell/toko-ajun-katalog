import { db } from "@/db";
import { promos } from "@/db/schema";
import { Promo } from "@/types/promo";
import { UnitBusinessHasPromo } from "@/types/unit-business-has-promo";
import { eq } from "drizzle-orm";

export type PromoIncludeRelationship = Promo & {
  unitBusinessHasPromo: UnitBusinessHasPromo[];
};

export async function getPromo({
  promoId,
}: {
  promoId: string;
}): Promise<{ promo: PromoIncludeRelationship | null }> {
  const promo = await db.query.promos.findFirst({
    where: eq(promos.id, BigInt(promoId)),
    with: {
      unitBusinessHasPromo: true,
    },
  });

  if (!promo)
    return {
      promo: null,
    };

  return {
    promo: promo,
  };
}
