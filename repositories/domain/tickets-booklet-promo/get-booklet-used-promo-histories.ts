import { db } from "@/db";
import { Booklet } from "@/types/booklet";
import { Promo } from "@/types/promo";
import { getTotalBookletUsedPromo } from "./get-total-booklet-used-promo";
import { BookletUsedPromoHistories } from "@/types/domains/tickets-booklet-promo/sales/general";

export async function getBookletUsedPromoHistories(
  promo: Promo | null,
  booklet: Booklet | null,
  bookletCode: string,
): Promise<{ bookletUsedPromoHistories: BookletUsedPromoHistories[] }> {
  if (!promo || !booklet)
    return {
      bookletUsedPromoHistories: [],
    };

  const bookletUsedPromoHistories = await db.query.bookletUsedPromos.findMany({
    with: {
      promo: {
        with: {
          bookletPromos: {
            columns: {
              qty: true,
            },
          },
        },
        columns: {
          id: true,
        },
      },
    },
    columns: {
      id: true,
      created_at: true,
    },
    where: (bookletUsedPromos, { and, eq }) =>
      and(
        eq(bookletUsedPromos.booklet_code, bookletCode),
        eq(bookletUsedPromos.promo_id, promo.id),
        eq(bookletUsedPromos.booklet_id, booklet.id),
      ),
  });

  const totalUsed = await getTotalBookletUsedPromo(bookletCode, booklet, promo);

  return {
    bookletUsedPromoHistories: bookletUsedPromoHistories.map((history) => ({
      id: history.id,
      total_used: totalUsed,
      limit: history.promo.bookletPromos[0].qty
        ? history.promo.bookletPromos[0].qty
        : 0,
      created_at: history.created_at,
    })),
  };
}
