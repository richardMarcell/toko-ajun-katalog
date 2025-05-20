import ButtonPrintCashRefundReceiptWithDialog from "@/components/internal/domains/button-print-cash-refund-receipt-with-dialog";
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
import {
  gazeboWallet,
  lockerWallet,
  // gazeboWallet,
  // lockerWallet,
  walletCashRefunds,
  walletHistories,
} from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import mapCashRefundReceipt from "@/lib/services/print-receipt/map-cash-refund-receipt";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

export default async function ReceiptSaldoWithdrawOnlyPage({
  params,
}: {
  params: Promise<{ walletId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [
      PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_RECEIPT_SALDO_WITHDRAW,
    ],
    user: user,
  });

  const { walletId } = await params;

  const walletHistoriesSaldoWithDrawLatest = (
    await db.query.walletHistories.findMany({
      columns: {
        wallet_cash_refund_id: true,
      },
      where: and(
        eq(
          walletHistories.transaction_type,
          WalletTransactionTypeEnum.SALDO_WITHDRAW,
        ),
        eq(walletHistories.wallet_id, BigInt(walletId)),
      ),
      orderBy: (walletHistories, { desc }) => desc(walletHistories.created_at),
    })
  )[0];

  if (
    !walletHistoriesSaldoWithDrawLatest ||
    !walletHistoriesSaldoWithDrawLatest.wallet_cash_refund_id
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
      walletHistoriesSaldoWithDrawLatest.wallet_cash_refund_id,
    ),
  });

  if (!walletCashRefund) return notFound();

  const cashRefundReceipt = mapCashRefundReceipt({
    walletCashRefund: walletCashRefund,
  });

  const gazeboRents = await db.query.gazeboWallet.findMany({
    columns: { type: true },
    with: { gazebo: { columns: { label: true } } },
    where: eq(gazeboWallet.wallet_id, BigInt(walletId)),
  });

  const lockerRents = await db.query.lockerWallet.findMany({
    columns: { type: true },
    with: { locker: { columns: { label: true } } },
    where: eq(lockerWallet.wallet_id, BigInt(walletId)),
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
                (cashRefundDetail, index) => (
                  <TableRow className="border-none" key={index}>
                    <TableCell>{cashRefundDetail.item}</TableCell>
                    <TableCell className="text-center">
                      {cashRefundDetail.qty}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumberToCurrency(
                        Number(cashRefundDetail.subtotal),
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

        <ButtonPrintCashRefundReceiptWithDialog
          cashRefundReceipt={cashRefundReceipt}
          gazeboRents={gazeboRents}
          lockerRents={lockerRents}
        />
      </CardContent>
    </Card>
  );
}
