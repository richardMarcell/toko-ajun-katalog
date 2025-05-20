import { TabBookletPromo } from "@/components/internal/domains/tickets-booklet-promo/general/tab-booklet-promo";
import { PanelOrder } from "@/components/internal/domains/tickets-booklet-promo/order/panel-order";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getCustomerOrigins } from "@/repositories/domain/tickets-booklet-promo/get-customer-origins";
import { getPromos } from "@/repositories/domain/tickets-booklet-promo/get-promos";
import { getTicketProducts } from "@/repositories/domain/tickets-booklet-promo/get-ticket-products";
import { redirect } from "next/navigation";
import authorizePromo from "../_libs/authorize-promo";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";

export default async function TicketBookletPromoOrderPage({
  searchParams,
}: {
  searchParams: Promise<{
    festive: string;
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

  const { festive, bookletCode, promoCode } = await searchParams;

  const isPromoAuthorize = await authorizePromo(promoCode, bookletCode);
  if (!promoCode || !isPromoAuthorize) redirect("/tickets-booklet-promo");

  const { promos } = await getPromos();
  const { ticketProducts } = await getTicketProducts({ festive });
  const { wristbandProduct } = await getWristbandProduct();
  const { customerOrigins } = await getCustomerOrigins();

  return (
    <div className="flex gap-6">
      <TabBookletPromo promos={promos} />

      <PanelOrder
        ticketProducts={ticketProducts}
        wristbandProduct={wristbandProduct}
        customerOrigins={customerOrigins}
      />
    </div>
  );
}
