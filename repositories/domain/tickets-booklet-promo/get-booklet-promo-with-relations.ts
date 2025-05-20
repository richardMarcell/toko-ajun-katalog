import { db } from "@/db";
import { Booklet } from "@/types/booklet";
import { BookletPromoWithRelation } from "@/types/domains/tickets-booklet-promo/sales/general";
import { Promo } from "@/types/promo";
import { getTotalBookletUsedPromo } from "./get-total-booklet-used-promo";

export async function getBookletPromoWithRelations(
  promo: Promo | null,
  booklet: Booklet | null,
  bookletCode: string,
): Promise<BookletPromoWithRelation | null> {
  if (!promo || !booklet) return null;

  const totalBookletUsedPromo = await getTotalBookletUsedPromo(
    bookletCode,
    booklet,
    promo,
  );

  const bookletPromo = await db.query.bookletPromo.findFirst({
    where: (bookletPromo, { eq, and }) =>
      and(
        eq(bookletPromo.promo_id, promo.id),
        eq(bookletPromo.booklet_id, booklet.id),
      ),
  });

  if (!bookletPromo) return null;

  const remainingCouponQuota = bookletPromo.qty - totalBookletUsedPromo;
  if (remainingCouponQuota < 1) return null;

  return {
    promo: promo,
    booklet_code: bookletCode,
    limit: bookletPromo.qty,
    total_used: totalBookletUsedPromo,
    remaining_coupon_quota: remainingCouponQuota,
  };
}
