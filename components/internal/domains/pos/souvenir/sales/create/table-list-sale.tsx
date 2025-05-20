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
import { SalesTemporary } from "@/types/domains/pos/souvenir/sales/create";
import { Edit } from "lucide-react";
import Link from "next/link";

export function TableListSale({
  salesTemporary,
  entryTime,
}: {
  salesTemporary: SalesTemporary;
  entryTime: Date;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Tanggal & Waktu</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {salesTemporary.sales_details.map((detail, index) => {
          const subtotal = detail.qty * detail.price;
          return (
            <TableRow key={detail.product_id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{formaterDate(entryTime, "dateTime")}</TableCell>
              <TableCell>{detail.product_name}</TableCell>
              <TableCell>{detail.qty}</TableCell>
              <TableCell>{formatNumberToCurrency(subtotal)}</TableCell>
              <TableCell>
                <Button asChild>
                  <Link
                    className="flex items-center justify-center"
                    href={`/pos/souvenir/order`}
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
