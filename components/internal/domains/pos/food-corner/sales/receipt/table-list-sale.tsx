import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { formatNumberToCurrency } from "@/lib/utils";
import { Sale } from "@/types/domains/pos/food-corner/sales/receipt";
import React from "react";

export function TableListSale({ sale }: { sale: Sale }) {
  return (
    <Table className="mt-8">
      <TableBody>
        {sale.sales_details.map((detail, index) => (
          <React.Fragment key={index}>
            <TableRow className="border-none">
              <TableCell className="font-bold" colSpan={4}>
                {detail.tenant}
              </TableCell>
            </TableRow>
            <TableRow className="border-none">
              <TableHead className="font-bold">Item</TableHead>
              <TableHead className="font-bold">Qty</TableHead>
              <TableHead className="text-right font-bold">Price</TableHead>
            </TableRow>
            {detail.products.map((product, index) => (
              <TableRow
                key={index}
                className={
                  detail.products.length == index + 1
                    ? "border-b"
                    : "border-none"
                }
              >
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.qty}</TableCell>
                <TableCell className="text-right">
                  {formatNumberToCurrency(Number(product.subtotal))}
                </TableCell>
              </TableRow>
            ))}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
