import { db } from "@/db";
import { unitBusinessHasPromo } from "../schema";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";

export async function unitBusinessHasPromoSeeder() {
  const promoList = await db.query.promos.findMany({
    columns: { id: true, name: true },
  });

  const unitBusinesses = Object.values(UnitBusinessSateliteQubuEnum);

  const unitBusinessHasPromoList: (typeof unitBusinessHasPromo.$inferInsert)[] =
    unitBusinesses.flatMap((unit_business) =>
      promoList.map((promo) => ({
        unit_business,
        promo_id: promo.id,
      })),
    );

  await Promise.all(
    unitBusinessHasPromoList.map((dataPromo) =>
      db.insert(unitBusinessHasPromo).values(dataPromo).onDuplicateKeyUpdate({
        set: dataPromo,
      }),
    ),
  );
}
