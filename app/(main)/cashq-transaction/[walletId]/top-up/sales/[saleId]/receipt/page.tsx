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
import { db } from "@/db";
import { walletHistories } from "@/db/schema";
import {
  getPaymentMethodCase,
  PaymentMethodEnum,
} from "@/lib/enums/PaymentMethodEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import mapSaleReceipt from "@/lib/services/print-receipt/map-sale-receipt";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

export default async function topUpReceiptPage({
  params,
}: {
  params: Promise<{ saleId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_TOP_UP_RECEIPT],
    user: user,
  });

  const { saleId } = await params;

  const sale = await db.query.sales.findFirst({
    with: {
      salesDetails: {
        columns: {
          qty: true,
          price: true,
          total_final: true,
        },
        with: {
          product: {
            columns: {
              name: true,
            },
          },
        },
      },
      payments: true,
      user: {
        columns: {
          name: true,
        },
      },
    },
    columns: {
      id: true,
      code: true,
      created_at: true,
      total_gross: true,
      discount_amount: true,
      total_net: true,
      tax_amount: true,
      grand_total: true,
      unit_business: true,
      print_count: true,
    },
    where: (sales, { eq, and }) => and(eq(sales.id, BigInt(saleId))),
  });

  if (!sale) return notFound();

  const walletHistory = await db.query.walletHistories.findFirst({
    with: { wallet: { columns: { customer_name: true } } },
    where: eq(walletHistories.sale_id, sale.id),
  });

  if (!walletHistory) return notFound();

  const recomposeSales = {
    ...sale,
    payment_method: sale.payments
      .map((payment) =>
        getPaymentMethodCase(payment.payment_method as PaymentMethodEnum),
      )
      .join(", "),
    total_payment: sale.payments
      .reduce(
        (totalPayment, payment) => totalPayment + Number(payment.total_payment),
        0,
      )
      .toString(),
    change_amount: sale.payments
      .reduce(
        (totalPayment, payment) => totalPayment + Number(payment.change_amount),
        0,
      )
      .toString(),
  };

  const saleReceipt = mapSaleReceipt({ sale: recomposeSales });

  const saleReceiptWithAdditional = {
    ...saleReceipt,
    customer_name: walletHistory.wallet?.customer_name ?? "",
  };

  return (
    <Card className="lg:w-1/2 xl:w-2/6">
      <CardContent className="flex w-full flex-col justify-center gap-4 p-4">
        <div className="w-full border p-4">
          <h1 className="pl-2 text-xl font-semibold">
            {saleReceiptWithAdditional.unit_business_name}
          </h1>

          <Table>
            <TableBody>
              <TableRow className="border-none">
                <TableCell>Date</TableCell>
                <TableCell>:</TableCell>
                <TableCell>
                  {formaterDate(saleReceiptWithAdditional.date, "dateTime")}
                </TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell>Nama Pelanggan</TableCell>
                <TableCell>:</TableCell>
                <TableCell>{walletHistory.wallet.customer_name}</TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell>Metode Bayar</TableCell>
                <TableCell>:</TableCell>
                <TableCell>
                  {saleReceiptWithAdditional.payment_method}
                </TableCell>
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
              {saleReceiptWithAdditional.sales_details.map((detail, index) => (
                <TableRow className="border-none" key={index}>
                  <TableCell>{detail.item}</TableCell>
                  <TableCell className="text-center">{detail.qty}</TableCell>
                  <TableCell className="text-right">
                    {formatNumberToCurrency(Number(detail.total_final))}
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
                  {formatNumberToCurrency(Number(walletHistory.amount))}
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
                  {formatNumberToCurrency(Number(walletHistory.amount))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <ButtonPrintReceipt
          saleReceipt={saleReceiptWithAdditional}
          redirectUrl="/cashq-transaction"
        />
      </CardContent>
    </Card>
  );
}
