import { PanelOrder } from "@/components/internal/domains/tickets/order/panel-order";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";
import { getCustomerOrigins } from "@/repositories/domain/tickets/get-customer-origins";
import { getTicketProducts } from "@/repositories/domain/tickets/get-ticket-products";
import { redirect } from "next/navigation";

export default async function TicketOrderPage({
  searchParams,
}: {
  searchParams: Promise<{
    festive: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.TICKET_SALES_CREATE],
    user: user,
  });

  const { festive } = await searchParams;

  const { ticketProducts } = await getTicketProducts({ festive });
  const { wristbandProduct } = await getWristbandProduct();
  const { customerOrigins } = await getCustomerOrigins();

  return (
    <PanelOrder
      ticketProducts={ticketProducts}
      wristbandProduct={wristbandProduct}
      customerOrigins={customerOrigins}
    />
  );
}
