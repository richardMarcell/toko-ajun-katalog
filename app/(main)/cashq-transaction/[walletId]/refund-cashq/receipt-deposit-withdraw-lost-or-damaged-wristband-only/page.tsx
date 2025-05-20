import ButtonPrintCashRefundReceipt from "@/components/internal/domains/button-print-cash-refund-receipt";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { walletCashRefunds, walletHistories } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import mapCashRefundReceipt from "@/lib/services/print-receipt/map-cash-refund-receipt";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

export default async function ReceiptDepositWithdrawLostOrDamagedOnlyPage({
  params,
}: {
  params: Promise<{ walletId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [
      PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_RECEIPT_DEPOSIT_WITHDRAW_LOST_DAMAGED_ONLY,
    ],
    user: user,
  });

  const { walletId } = await params;

  const walletHistoriesDepositWithDrawLatest = (
    await db.query.walletHistories.findMany({
      columns: {
        wallet_cash_refund_id: true,
      },
      where: and(
        eq(
          walletHistories.transaction_type,
          WalletTransactionTypeEnum.DEPOSIT_WITHDRAW,
        ),
        eq(walletHistories.wallet_id, BigInt(walletId)),
      ),
      orderBy: (walletHistories, { desc }) => desc(walletHistories.created_at),
    })
  )[0];

  if (
    !walletHistoriesDepositWithDrawLatest ||
    !walletHistoriesDepositWithDrawLatest.wallet_cash_refund_id
  )
    return notFound();

  const walletCashRefund = await db.query.walletCashRefunds.findFirst({
    columns: {
      id: true,
      total_refund: true,
      created_at: true,
    },
    with: {
      walletCashRefundDetails: {
        columns: { id: true, item_name: true, item_qty: true, subtotal: true },
      },
      createBy: { columns: { name: true } },
    },
    where: eq(
      walletCashRefunds.id,
      walletHistoriesDepositWithDrawLatest.wallet_cash_refund_id,
    ),
  });

  if (!walletCashRefund) return notFound();

  const cashRefundReceipt = mapCashRefundReceipt({
    walletCashRefund: walletCashRefund,
  });

  return (
    <Card className="lg:w-1/2 xl:w-2/6">
      <CardContent className="flex w-full flex-col justify-center gap-4 p-4">
        <div className="w-full border p-4">
          <h1 className="pl-2 text-xl font-semibold">Refund</h1>

          <Table>
            <TableBody>
              <TableRow className="border-none">
                <TableCell>Date</TableCell>
                <TableCell>:</TableCell>
                <TableCell>
                  {formaterDate(cashRefundReceipt.date, "dateTime")}
                </TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell>Operator</TableCell>
                <TableCell>:</TableCell>
                <TableCell>{cashRefundReceipt.op}</TableCell>
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
              {cashRefundReceipt.cash_refund_details.map(
                (walletCashRefundDetail, index) => (
                  <TableRow className="border-none" key={index}>
                    <TableCell>{walletCashRefundDetail.item}</TableCell>
                    <TableCell className="text-center">
                      {walletCashRefundDetail.qty}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumberToCurrency(
                        Number(walletCashRefundDetail.subtotal),
                      )}
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>

          <Table className="mt-8">
            <TableBody>
              <TableRow className="border-none">
                <TableCell className="text-2xl font-bold">Total</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right text-2xl font-bold">
                  {formatNumberToCurrency(
                    Number(cashRefundReceipt.total_refund),
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <ButtonPrintCashRefundReceipt
          cashRefundReceipt={cashRefundReceipt}
          redirectUrl={`/cashq-transaction/${walletId}/refund-cashq/return-wristband`}
        />
      </CardContent>
    </Card>
  );
}
