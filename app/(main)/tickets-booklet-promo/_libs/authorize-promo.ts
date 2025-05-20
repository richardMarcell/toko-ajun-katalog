import { getValidBooklet } from "@/repositories/domain/general/get-valid-booklet";
import { getValidBookletPromo } from "@/repositories/domain/general/get-valid-booklet-promo";
import { getValidPromo } from "@/repositories/domain/general/get-valid-promo";
import { getTotalBookletUsedPromo } from "@/repositories/domain/tickets-booklet-promo/get-total-booklet-used-promo";

export default async function authorizePromo(
  promoCode: string,
  bookletCode: string,
): Promise<boolean> {
  const { promo } = await getValidPromo(promoCode);
  if (!promo) return false;

  if (promo.is_required_booklet) {
    const { booklet } = await getValidBooklet(bookletCode);
    if (!booklet) return false;

    const { bookletPromo } = await getValidBookletPromo(booklet, promo);
    if (!bookletPromo) return false;

    const totalBookletUsedPromo = await getTotalBookletUsedPromo(
      bookletCode,
      booklet,
      promo,
    );

    if (totalBookletUsedPromo >= bookletPromo.qty) return false;
  }

  return true;
}
