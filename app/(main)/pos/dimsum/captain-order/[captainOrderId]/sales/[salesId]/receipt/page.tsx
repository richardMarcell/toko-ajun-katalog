import ButtonPrintReceipt from "@/components/internal/domains/button-print-receipt";
import { Card, CardContent } from "@/components/ui/card";
import { notFound, redirect } from "next/navigation";
import { HeaderReceipt } from "./_components/header-receipt";
import { TableListSale } from "./_components/table-list-sale";
import { SummaryReceipt } from "./_components/summary-receipt";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { can } from "@/lib/services/permissions/can";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { getSale } from "@/app/(main)/pos/dimsum/_repositories/get-sale";

export default async function DimsumReceiptPage({
  params,
}: {
  params: Promise<{
    captainOrderId: string;
    salesId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.DIMSUM_SALES_RECEIPT],
    user: user,
  });

  const { salesId, captainOrderId } = await params;

  const { saleReceipt } = await getSale({ salesId: BigInt(salesId) });
  if (!saleReceipt) return notFound();

  return (
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
          redirectUrl={`/pos/dimsum/captain-order/${captainOrderId}/edit`}
        />
      </CardContent>
    </Card>
  );
}
