import { PanelOrder } from "@/components/internal/domains/tickets-online/sales/create/panel-order";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getCustomerOrigins } from "@/repositories/domain/tickets-online/get-customer-origins";
import { getTicketProducts } from "@/repositories/domain/tickets-online/get-ticket-products";
import { getVendorTypes } from "@/repositories/domain/tickets-online/get-vendor-types";
import { redirect } from "next/navigation";

export default async function TicketOnlineSalesCreatePage({
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
  const { customerOrigins } = await getCustomerOrigins();
  const { vendorTypes } = await getVendorTypes();

  return (
    <PanelOrder
      customerOrigins={customerOrigins}
      ticketProducts={ticketProducts}
      vendorTypes={vendorTypes}
    />
  );
}
