import ButtonPrintReceipt from "@/components/internal/domains/button-print-receipt";
import { HeaderReceipt } from "@/components/internal/domains/tickets-booklet-promo/sales/receipt/header-receipt";
import { SummaryReceipt } from "@/components/internal/domains/tickets-booklet-promo/sales/receipt/summary-receipt";
import { TableListSale } from "@/components/internal/domains/tickets-booklet-promo/sales/receipt/table-list-sale";
import { Card, CardContent } from "@/components/ui/card";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getSale } from "@/repositories/domain/tickets-booklet-promo/get-sale";
import { notFound, redirect } from "next/navigation";

export default async function TicketBookletPromoSalesReceiptPage({
  params,
}: {
  params: Promise<{ salesId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.TICKET_SALES_RECEIPT],
    user: user,
  });

  const { salesId } = await params;
  const { saleReceipt } = await getSale({
    salesId: BigInt(salesId),
  });

  if (!saleReceipt) return notFound();

  return (
    <div>
      <Card className="lg:w-1/2 xl:w-2/6">
        <CardContent className="flex w-full flex-col justify-center gap-4 p-4">
          <div className="w-full border p-4">
            <h1 className="pl-2 text-xl font-semibold">
              {saleReceipt.unit_business_name}
            </h1>
            <HeaderReceipt sale={saleReceipt} />
            <TableListSale sale={saleReceipt} />
            <SummaryReceipt sale={saleReceipt} />
          </div>

          <ButtonPrintReceipt
            saleReceipt={saleReceipt}
            redirectUrl="/tickets-booklet-promo"
          />
        </CardContent>
      </Card>
    </div>
  );
}
