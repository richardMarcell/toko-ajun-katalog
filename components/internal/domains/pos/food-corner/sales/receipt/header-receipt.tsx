import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formaterDate } from "@/lib/utils";
import { Sale } from "@/types/domains/pos/food-corner/sales/receipt";

export function HeaderReceipt({ sale }: { sale: Sale }) {
  return (
    <Table>
      <TableBody>
        <TableRow className="border-none">
          <TableCell>Date</TableCell>
          <TableCell>:</TableCell>
          <TableCell>{formaterDate(sale.created_at, "dateTime")}</TableCell>
        </TableRow>
        <TableRow className="border-none">
          <TableCell>Nomor Meja</TableCell>
          <TableCell>:</TableCell>
          <TableCell>{sale.table_number}</TableCell>
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
