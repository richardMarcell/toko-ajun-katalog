import { db } from "@/db";
import { bookletUsedPromos } from "@/db/schema";
import { Booklet } from "@/types/booklet";
import { Promo } from "@/types/promo";
import { and, count, eq } from "drizzle-orm";

export async function getTotalBookletUsedPromo(
  bookletCode: string,
  booklet: Booklet,
  promo: Promo,
): Promise<number> {
  const totalBookletUsedPromo = await db
    .select({
      count: count(),
    })
    .from(bookletUsedPromos)
    .where(
      and(
        eq(bookletUsedPromos.booklet_code, bookletCode),
        eq(bookletUsedPromos.promo_id, promo.id),
        eq(bookletUsedPromos.booklet_id, booklet.id),
      ),
    );

  return totalBookletUsedPromo[0].count;
}
