import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatNumberToCurrency } from "@/lib/utils";
import { SaleReceipt } from "@/types/sale-receipt";

export function SummaryReceipt({ sale }: { sale: SaleReceipt }) {
  return (
    <Table className="mt-8">
      <TableBody>
        <TableRow className="border-none">
          <TableCell className="font-bold">Subtotal</TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right">
            {formatNumberToCurrency(Number(sale.total_gross))}
          </TableCell>
        </TableRow>
        <TableRow className="border-none">
          <TableCell className="font-bold">Discount</TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right">
            {formatNumberToCurrency(sale.discount_amount)}
          </TableCell>
        </TableRow>
        <TableRow className="border-none">
          <TableCell className="font-bold">Pajak</TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right">
            {formatNumberToCurrency(sale.tax_amount)}
          </TableCell>
        </TableRow>
        <TableRow className="border-none">
          <TableCell className="text-2xl font-bold">Total</TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right text-2xl font-bold">
            {formatNumberToCurrency(sale.grand_total)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
