import { db } from "@/db";
import { unitBusinessHasPromo } from "@/db/schema";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { Promo } from "@/types/promo";
import { eq } from "drizzle-orm";

export default async function getUnitBusinessPromo(
  unitBusiness: UnitBusinessSateliteQubuEnum,
): Promise<{ promoList: Promo[] }> {
  const unitBusinessPromo = await db.query.unitBusinessHasPromo.findMany({
    with: {
      promo: true,
    },
    where: eq(unitBusinessHasPromo.unit_business, unitBusiness),
  });

  return { promoList: unitBusinessPromo.map(({ promo }) => promo) };
}
