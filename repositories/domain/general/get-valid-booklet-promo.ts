import { db } from "@/db";
import { Booklet } from "@/types/booklet";
import { BookletPromo } from "@/types/booklet-promo";
import { Promo } from "@/types/promo";

export async function getValidBookletPromo(
  booklet: Booklet,
  promo: Promo,
): Promise<{
  bookletPromo: BookletPromo | null;
}> {
  const bookletPromo = await db.query.bookletPromo.findFirst({
    where: (bookletPromo, { eq, and }) =>
      and(
        eq(bookletPromo.booklet_id, booklet.id),
        eq(bookletPromo.promo_id, promo.id),
      ),
  });

  if (!bookletPromo)
    return {
      bookletPromo: null,
    };

  return {
    bookletPromo: bookletPromo,
  };
}
