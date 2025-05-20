import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formaterDate } from "@/lib/utils";
import { SaleReceipt } from "@/types/sale-receipt";

export function HeaderReceipt({ sale }: { sale: SaleReceipt }) {
  return (
    <Table>
      <TableBody>
        <TableRow className="border-none">
          <TableCell>Date</TableCell>
          <TableCell>:</TableCell>
          <TableCell>{formaterDate(sale.date, "dateTime")}</TableCell>
        </TableRow>
        <TableRow className="border-none">
          <TableCell>Nama Pelanggan</TableCell>
          <TableCell>:</TableCell>
          <TableCell>{sale?.customer_name}</TableCell>
        </TableRow>
        <TableRow className="border-none">
          <TableCell>Metode Bayar</TableCell>
          <TableCell>:</TableCell>
          <TableCell>{sale.payment_method}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
