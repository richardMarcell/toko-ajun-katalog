import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumberToCurrency } from "@/lib/utils";
import Image from "next/image";
import { SaleIncluRelationship } from "../_repositories/get-sale";

export function TableListSaleDetails({
  sale,
  urlLocal,
}: {
  sale: SaleIncluRelationship;
  urlLocal: string;
}) {
  return (
    <Table data-testid="table-order-items">
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sale.salesDetails.map((detail, index) => {
          const subtotal = detail.qty * Number(detail.price);
          return (
            <TableRow key={detail.product_id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Image
                  src={`${urlLocal}/${detail.product.image}`}
                  alt={detail.product.name}
                  width={100}
                  height={100}
                  loading="lazy"
                  className="object-cover"
                />
                <div>{detail.product.name}</div>
              </TableCell>
              <TableCell>{detail.qty}</TableCell>
              <TableCell>{detail.note ?? "-"}</TableCell>
              <TableCell>{formatNumberToCurrency(subtotal)}</TableCell>
            </TableRow>
          );
        })}
        <TableRow>
          <TableCell className="text-right text-xl font-bold" colSpan={4}>
            Total
          </TableCell>
          <TableCell className="text-xl font-bold">
            {formatNumberToCurrency(Number(sale.grand_total))}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
