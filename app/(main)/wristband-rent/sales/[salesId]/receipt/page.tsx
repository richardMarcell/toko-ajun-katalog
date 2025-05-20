import ButtonPrintReceipt from "@/components/internal/domains/button-print-receipt";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import {
  getDisplayUnitBusinessSatelite,
  UnitBusinessSateliteQubuEnum,
} from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import getSaleReceipt from "../../_repo/get-sale-receipt";

export default async function SalesReceiptPage({
  params,
}: {
  params: Promise<{ salesId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.WRISTBAND_RENT_WALLET_RECEIPT],
    user: user,
  });

  const { salesId } = await params;

  const { saleReceipt } = await getSaleReceipt({
    salesId: BigInt(salesId),
  });

  if (!saleReceipt) return notFound();

  return (
    <div>
      <Card className="lg:w-1/2 xl:w-2/6">
        <CardContent className="flex w-full flex-col justify-center gap-4 p-4">
          <div className="w-full border p-4">
            <h1 className="pl-2 text-xl font-semibold">
              {getDisplayUnitBusinessSatelite(
                UnitBusinessSateliteQubuEnum.LOCKER,
              )}
            </h1>

            <Table>
              <TableBody>
                <TableRow className="border-none">
                  <TableCell>Date</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>
                    {formaterDate(saleReceipt.date, "dateTime")}
                  </TableCell>
                </TableRow>
                <TableRow className="border-none">
                  <TableCell>Nama Pelanggan</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{saleReceipt.customer_name}</TableCell>
                </TableRow>
                <TableRow className="border-none">
                  <TableCell>Metode Bayar</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{saleReceipt.payment_method}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Table className="mt-8">
              <TableHeader>
                <TableRow className="border-none">
                  <TableHead className="font-bold">Item</TableHead>
                  <TableHead className="text-center font-bold">Qty</TableHead>
                  <TableHead className="text-right font-bold">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saleReceipt.sales_details.map((detail, index) => (
                  <TableRow className="border-none" key={index}>
                    <TableCell>{detail.item}</TableCell>
                    <TableCell className="text-center">{detail.qty}</TableCell>
                    <TableCell className="text-right">
                      {formatNumberToCurrency(detail.total_final)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Table className="mt-8">
              <TableBody>
                <TableRow className="border-none">
                  <TableCell className="font-bold">Subtotal</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    {formatNumberToCurrency(saleReceipt.grand_total)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-none">
                  <TableCell className="font-bold">Discount</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    {formatNumberToCurrency(0)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-none">
                  <TableCell className="font-bold">Pajak</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    {formatNumberToCurrency(0)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-none">
                  <TableCell className="text-2xl font-bold">Total</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right text-2xl font-bold">
                    {formatNumberToCurrency(saleReceipt.grand_total)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <ButtonPrintReceipt
            saleReceipt={saleReceipt}
            redirectUrl="/cashq-transaction"
          />
        </CardContent>
      </Card>
    </div>
  );
}
