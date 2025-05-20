import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatNumberToCurrency } from "@/lib/utils";
import { Sale } from "@/types/domains/tickets/sales/receipt";

export function SummaryReceiptWristbandNotStoredToSales({
  sale,
  walletCashReceive,
}: {
  sale: Sale;
  walletCashReceive: { grand_total: string };
}) {
  return (
    <Table className="mt-8">
      <TableBody>
        <TableRow className="border-none">
          <TableCell className="font-bold">Subtotal</TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right">
            {formatNumberToCurrency(
              Number(sale.total_gross) + Number(walletCashReceive.grand_total),
            )}
          </TableCell>
        </TableRow>
        <TableRow className="border-none">
          <TableCell className="font-bold">Discount</TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right">
            {formatNumberToCurrency(Number(sale.discount_amount))}
          </TableCell>
        </TableRow>
        <TableRow className="border-none">
          <TableCell className="font-bold">Pajak</TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right">
            {formatNumberToCurrency(Number(sale.tax_amount))}
          </TableCell>
        </TableRow>
        <TableRow className="border-none">
          <TableCell className="text-2xl font-bold">Total</TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right text-2xl font-bold">
            {formatNumberToCurrency(
              Number(sale.grand_total) + Number(walletCashReceive.grand_total),
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
