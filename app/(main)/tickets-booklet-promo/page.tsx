import { TabBookletPromo } from "@/components/internal/domains/tickets-booklet-promo/general/tab-booklet-promo";
import { PanelCheckBooklet } from "@/components/internal/domains/tickets-booklet-promo/list/panel-check-booklet";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getValidBooklet } from "@/repositories/domain/general/get-valid-booklet";
import { getValidPromo } from "@/repositories/domain/general/get-valid-promo";
import { getBookletPromoWithRelations } from "@/repositories/domain/tickets-booklet-promo/get-booklet-promo-with-relations";
import { getBookletUsedPromoHistories } from "@/repositories/domain/tickets-booklet-promo/get-booklet-used-promo-histories";
import { getPromos } from "@/repositories/domain/tickets-booklet-promo/get-promos";
import { redirect } from "next/navigation";
export default async function BookletPromoPage({
  searchParams,
}: {
  searchParams: Promise<{
    promoCode: string;
    bookletCode: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.TICKET_SALES_CREATE],
    user: user,
  });

  const { promoCode, bookletCode } = await searchParams;

  const { promos } = await getPromos();

  const { promo } = await getValidPromo(promoCode);
  const { booklet } = await getValidBooklet(bookletCode);
  const bookletPromoWithRelations = await getBookletPromoWithRelations(
    promo,
    booklet,
    bookletCode,
  );

  const { bookletUsedPromoHistories } = await getBookletUsedPromoHistories(
    promo,
    booklet,
    bookletCode,
  );

  return (
    <div className="flex gap-6">
      <TabBookletPromo promos={promos} />

      {promo && (
        <PanelCheckBooklet
          bookletPromoWithRelations={bookletPromoWithRelations}
          bookletUsedPromoHistories={bookletUsedPromoHistories}
        />
      )}
    </div>
  );
}
