import { db } from "@/db";
import { promos } from "@/db/schema";
import { getDateStartTime } from "@/lib/utils";
import { Promo } from "@/types/promo";
import { and, eq, gte, lte } from "drizzle-orm";

export async function getValidPromo(promoCode: string): Promise<{
  promo: Promo | null;
}> {
  const today = getDateStartTime();

  const promo = await db.query.promos.findFirst({
    where: and(
      eq(promos.code, promoCode),
      lte(promos.periode_start, today),
      gte(promos.periode_end, today),
      eq(promos.is_active, true),
    ),
  });

  if (!promo)
    return {
      promo: null,
    };

  return {
    promo: promo,
  };
}
