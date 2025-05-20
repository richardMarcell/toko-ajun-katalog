import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumberToCurrency } from "@/lib/utils";
import { Sale } from "@/types/domains/tickets/sales/receipt";
import React from "react";

export function TableListSale({ sale }: { sale: Sale }) {
  return (
    <Table className="mt-8">
      <TableHeader>
        <TableRow className="border-none">
          <TableHead className="font-bold">Item</TableHead>
          <TableHead className="text-center font-bold">Qty</TableHead>
          <TableHead className="text-right font-bold">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sale.sales_details.map((detail, index) => (
          <TableRow className="border-none" key={index}>
            <TableCell>{detail.product_description}</TableCell>
            <TableCell className="text-center">{detail.qty}</TableCell>
            <TableCell className="text-right">
              {formatNumberToCurrency(Number(detail.subtotal))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
