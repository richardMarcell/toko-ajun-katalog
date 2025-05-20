import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { SwimsuitRentTemporary } from "@/types/domains/swimsuit-rent/general";
import { Edit } from "lucide-react";
import Link from "next/link";

export function TableListSale({
  swimsuitRentTemporary,
}: {
  swimsuitRentTemporary: SwimsuitRentTemporary;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Tanggal & Waktu</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Kode Barang</TableHead>
          <TableHead>Harga</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {swimsuitRentTemporary.sales_details.map((detail, index) => {
          const subtotal = detail.qty * detail.price;
          return (
            <TableRow key={detail.product_id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {formaterDate(
                  swimsuitRentTemporary.created_at,
                  "dateTime",
                  false,
                )}
              </TableCell>
              <TableCell>{detail.product_name}</TableCell>
              <TableCell>{detail.product_code}</TableCell>
              <TableCell>{formatNumberToCurrency(detail.price)}</TableCell>
              <TableCell>{detail.qty}</TableCell>
              <TableCell>{formatNumberToCurrency(subtotal)}</TableCell>
              <TableCell>
                <Button type="button" asChild>
                  <Link
                    className="flex items-center justify-center"
                    href={`/swimsuit-rent/create`}
                  >
                    <Edit />
                    <span>Edit</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
