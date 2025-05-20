import { Button } from "@/components/ui/button";
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
import { sales, salesDetails, wallets, walletWristband } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import {
  getDisplayUnitBusinessSatelite,
  UnitBusinessSateliteQubuEnum,
} from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { WalletWristbandReturnStatusEnum } from "@/lib/enums/WalletWristbandReturnStatusEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { and, eq, inArray } from "drizzle-orm";
import { Printer } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function VoidReceiptPage({
  params,
}: {
  params: Promise<{ walletId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [
      PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_RECEIPT_DEPOSIT_WITHDRAW,
    ],
    user: user,
  });

  const { walletId } = await params;

  const wallet = await db.query.wallets.findFirst({
    with: {
      walletHistories: true,
      walletWristbands: {
        where: eq(
          walletWristband.return_status,
          WalletWristbandReturnStatusEnum.HAS_RETURNED,
        ),
      },
      swimsuitRentWallet: {
        columns: {
          id: true,
        },
        with: {
          saleDetail: {
            columns: {
              product_id: true,
              qty: true,
            },
          },
        },
      },
      lockerWallets: {
        columns: {
          id: true,
          locker_id: true,
        },
      },
      gazeboWallets: {
        columns: {
          id: true,
          gazebo_id: true,
        },
      },
    },
    where: eq(wallets.id, BigInt(walletId)),
  });

  if (!wallet) return notFound();

  const saldoWithdraw = Number(
    wallet.walletHistories.filter(
      ({ transaction_type }) =>
        transaction_type === WalletTransactionTypeEnum.SALDO_WITHDRAW,
    )[0].amount,
  );

  const depositWithdraw = Number(
    wallet.walletHistories.filter(
      ({ transaction_type }) =>
        transaction_type === WalletTransactionTypeEnum.DEPOSIT_WITHDRAW,
    )[0].amount,
  );

  const saleIds = wallet.walletHistories
    .map(({ transaction_type, sale_id }) => {
      if (
        transaction_type === WalletTransactionTypeEnum.DEPOSIT ||
        transaction_type === WalletTransactionTypeEnum.TOP_UP
      )
        return null;
      return sale_id;
    })
    .filter((saleId) => saleId !== null);

  const walletSales = await db.query.sales.findMany({
    columns: {
      id: true,
      discount_amount: true,
      tax_amount: true,
      total_gross: true,
      grand_total: true,
      transaction_type: true,
    },
    with: { salesDetails: true },
    where: inArray(sales.id, saleIds),
  });

  const totalDiscount = walletSales.reduce((total, salesId) => {
    return total + parseFloat(salesId.discount_amount);
  }, 0);

  const totalTax = walletSales.reduce((total, salesId) => {
    return total + parseFloat(salesId.tax_amount);
  }, 0);

  const totalGross =
    walletSales.reduce((total, sales) => {
      return total + parseFloat(sales.total_gross);
    }, 0) +
    Math.abs(saldoWithdraw) +
    Math.abs(depositWithdraw);

  const walletSalesDetail = await db.query.salesDetails.findMany({
    columns: {
      qty: true,
      subtotal: true,
      product_id: true,
    },
    with: {
      product: {
        columns: {
          name: true,
        },
      },
    },
    where: and(
      inArray(salesDetails.sales_id, saleIds),
      eq(salesDetails.is_send_to_scm, true),
    ),
  });

  const groupedSalesDetail = Object.values(
    walletSalesDetail.reduce(
      (acc, item) => {
        const key = item.product_id.toString();
        if (!acc[key]) {
          acc[key] = {
            ...item,
            qty: 0,
            subtotal: 0,
          };
        }
        acc[key].qty += item.qty;
        acc[key].subtotal += parseFloat(item.subtotal);
        return acc;
      },
      {} as Record<
        string,
        {
          qty: number;
          subtotal: number;
          product_id: bigint;
          product: { name: string };
        }
      >,
    ),
  );

  const totalSalesAmountRetuned = walletSales
    .map((sale) => Number(sale.grand_total))
    .reduce((total, saleAmount) => total + saleAmount, 0);

  const totalAmountRetuned =
    totalSalesAmountRetuned +
    Math.abs(saldoWithdraw) +
    Math.abs(depositWithdraw);

  return (
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
                  {/* TODO: add column receipted_at on table wallet */}
                  {formaterDate(wallet.created_at, "dateTime")}
                </TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell>Nama Pelanggan</TableCell>
                <TableCell>:</TableCell>
                <TableCell>{wallet.customer_name}</TableCell>
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
              {/* Deposit wristband */}
              {wallet.walletWristbands.map((walletWristband) => (
                <TableRow
                  className="border-none"
                  key={walletWristband.wristband_code}
                >
                  <TableCell>
                    Gelang #{walletWristband.wristband_code}
                  </TableCell>
                  <TableCell className="text-center">1</TableCell>
                  <TableCell className="text-right">
                    {formatNumberToCurrency(25000)}
                  </TableCell>
                </TableRow>
              ))}

              {/* Saldo */}
              <TableRow className="border-none">
                <TableCell>Saldo</TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-right">
                  {formatNumberToCurrency(Math.abs(saldoWithdraw))}
                </TableCell>
              </TableRow>

              {/* Sales detail */}
              {groupedSalesDetail.map((saleDetail) => (
                <TableRow className="border-none" key={saleDetail.product_id}>
                  <TableCell>{saleDetail.product.name}</TableCell>
                  <TableCell className="text-center">
                    {saleDetail.qty}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumberToCurrency(saleDetail.subtotal)}
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
                  {formatNumberToCurrency(Number(totalGross))}
                </TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell className="font-bold">Discount</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">
                  {formatNumberToCurrency(Number(totalDiscount))}
                </TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell className="font-bold">Pajak</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">
                  {formatNumberToCurrency(Number(totalTax))}
                </TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell className="text-2xl font-bold">Total</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right text-2xl font-bold">
                  {formatNumberToCurrency(totalAmountRetuned)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Button
          className="flex w-full items-center justify-center gap-2"
          asChild
        >
          {/* TODO: add function to print */}
          <Link href="/cashq-transaction">
            <Printer />
            <span>Cetak Struk</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
