"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formaterDate,
  formatNumberToCurrency,
  getCurrentDate,
} from "@/lib/utils";
import { SalesTemporary } from "@/types/domains/tickets/sales/general";
import { Edit } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export function TableListSale() {
  const ticketSalesTemporary: SalesTemporary = JSON.parse(
    sessionStorage.getItem("ticket-sales-temporary") as string,
  );
  if (!ticketSalesTemporary) redirect("/tickets/order");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Tanggal & Waktu</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Harga</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ticketSalesTemporary.sales_details.map((detail, index) => {
          const subtotal = detail.qty * detail.price;
          return (
            <TableRow key={detail.product_id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {formaterDate(getCurrentDate(), "dateTime")}
              </TableCell>
              <TableCell>{ticketSalesTemporary.customer_name}</TableCell>
              <TableCell>{detail.description}</TableCell>
              <TableCell>{formatNumberToCurrency(detail.price)}</TableCell>
              <TableCell>{detail.qty}</TableCell>
              <TableCell>{formatNumberToCurrency(subtotal)}</TableCell>
              <TableCell>
                <Button type="button" asChild>
                  <Link
                    className="flex items-center justify-center"
                    href={`/tickets/order`}
                  >
                    <Edit />
                    <span>Edit</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}

        <TableRow>
          <TableCell>{ticketSalesTemporary.sales_details.length + 1}</TableCell>
          <TableCell>{formaterDate(getCurrentDate(), "dateTime")}</TableCell>
          <TableCell>{ticketSalesTemporary.customer_name}</TableCell>
          <TableCell>Gelang</TableCell>
          <TableCell>
            {ticketSalesTemporary.wristband_qty > 0
              ? formatNumberToCurrency(
                  ticketSalesTemporary.total_deposit /
                    ticketSalesTemporary.wristband_qty,
                )
              : formatNumberToCurrency(0)}
          </TableCell>
          <TableCell>{ticketSalesTemporary.wristband_qty}</TableCell>
          <TableCell>
            {formatNumberToCurrency(ticketSalesTemporary.total_deposit)}
          </TableCell>
          <TableCell>
            <Button type="button" asChild>
              <Link
                className="flex items-center justify-center"
                href={`/tickets/order`}
              >
                <Edit />
                <span>Edit</span>
              </Link>
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
