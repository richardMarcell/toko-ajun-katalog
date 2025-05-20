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
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { Edit } from "lucide-react";
import Link from "next/link";
import { CaptainOrderIncludeRelationship } from "../../../edit/_types/edit";
import { notFound } from "next/navigation";

type SaleDetail = {
  product_id: number;
  product_name: string;
  qty: number;
  price: number;
  note?: string | null;
};

type RestoSalesTemporary = {
  captain_order_id: number;
  sales_details: SaleDetail[];
  total_gross: number;
  total_net: number;
  grand_total: number;
  tax_percent: number;
  tax_amount: number;
  discount_percent: number;
  discount_amount: number;
  created_at: Date;
};

export function TableListOrderedProduct({
  captainOrder,
}: {
  captainOrder: CaptainOrderIncludeRelationship;
}) {
  const restoSalesTemporary: RestoSalesTemporary = JSON.parse(
    sessionStorage.getItem(
      `resto-sales-temporary-${captainOrder.id}`,
    ) as string,
  );

  if (!restoSalesTemporary) return notFound();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Tanggal & Waktu</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Catatan</TableHead>
          <TableHead>Harga</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {restoSalesTemporary.sales_details.map((detail, index) => {
          const subtotal = Number(detail.price) * detail.qty;
          return (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {formaterDate(
                  restoSalesTemporary.created_at,
                  "dateTime",
                  false,
                )}
              </TableCell>
              <TableCell>{detail.product_name}</TableCell>
              <TableCell>{detail.qty}</TableCell>
              <TableCell>{detail.note ? detail.note : "-"}</TableCell>
              <TableCell>{formatNumberToCurrency(subtotal)}</TableCell>
              <TableCell>
                <Button type="button" asChild>
                  <Link
                    className="flex items-center justify-center"
                    href={`/pos/resto/patio/captain-order/${captainOrder.id}/edit`}
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
