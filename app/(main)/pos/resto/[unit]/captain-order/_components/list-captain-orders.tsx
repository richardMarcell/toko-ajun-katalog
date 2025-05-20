"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getCaptainOrderOutletCase,
  CaptainOrderOutleEnum,
} from "@/lib/enums/CaptainOrderOutletEnum";
import { cn, formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";
import { BookmarkCheck, ChevronDown, FileX, NotepadText } from "lucide-react";
import Link from "next/link";

type CaptainOrderDetail = {
  product_name: string;
  qty: number;
  subtotal: string;
  price: string;
};

type CaptainOrder = {
  id: bigint;
  code: string;
  order_number: string;
  is_closed: boolean;
  customer_name: string;
  outlet: string;
  table_or_room_number: string;
  order_type: string;
  created_at: Date;
  tax_amount: string;
  grand_total: string;
  total_qty: number;
  total_paid_qty: number;
  captain_order_details: CaptainOrderDetail[];
};

export function ListCaptanOrders({
  captainOrders,
}: {
  captainOrders: CaptainOrder[];
}) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div>
      {captainOrders.length === 0 && (
        <div className="p-8 text-center">
          <FileX size={48} className="mx-auto mb-4 text-gray-500" />
          <h2 className="mb-2 text-2xl font-bold">Order Kosong</h2>
          <p className="mb-4 text-gray-600">
            Saat ini belum ada order yang masuk.
          </p>
        </div>
      )}

      <div
        className={cn(
          "grid gap-4 pt-4",
          isCollapsed
            ? "lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-2 xl:grid-cols-3",
        )}
      >
        {captainOrders.map((captainOrder) => (
          <CardOrder key={captainOrder.id} captainOrder={captainOrder} />
        ))}
      </div>
    </div>
  );
}

function CardOrder({ captainOrder }: { captainOrder: CaptainOrder }) {
  return (
    <Card className="p-4">
      <CardContent className="space-y-4 p-4">
        <div className="flex justify-between border-b pb-4">
          <div className="flex items-center gap-2 text-lg font-bold">
            <NotepadText />
            <span>{captainOrder.code}</span>
          </div>

          <div className="flex w-24 items-center gap-1 rounded-lg border-2 border-qubu_blue bg-qubu_light_blue p-1 text-sm font-semibold text-qubu_blue">
            <BookmarkCheck />
            <span>{captainOrder.is_closed ? "Closed" : "Open"}</span>
          </div>
        </div>

        <div className="space-y-4 border-b pb-4">
          <div className="flex justify-between">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-100 font-semibold text-qubu_blue">
                {captainOrder.table_or_room_number}
              </div>
              <div>
                <div className="font-bold">{captainOrder.customer_name}</div>
                <div className="text-xs">{captainOrder.order_number}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold">{captainOrder.order_type}</div>
              <div className="text-sm font-medium">
                {getCaptainOrderOutletCase(
                  captainOrder.outlet as CaptainOrderOutleEnum,
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-qubu_dark_gray">
            <span>{formaterDate(captainOrder.created_at, "date")}</span>
            <span>{formaterDate(captainOrder.created_at, "time")}</span>
          </div>
        </div>

        <div className="flex h-[270px] flex-col">
          <Table className="flex-grow border-b">
            <TableHeader>
              <TableRow className="border-none">
                <TableHead className="px-0">Items</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {captainOrder.captain_order_details
                .slice(0, 3)
                .map((detail, index) => (
                  <TableRow key={index} className="border-none">
                    <TableCell className="px-0">
                      {detail.product_name}
                    </TableCell>
                    <TableCell className="text-center">{detail.qty}</TableCell>
                    <TableCell className="text-right">
                      {formatNumberToCurrency(Number(detail.subtotal))}
                    </TableCell>
                  </TableRow>
                ))}

              {captainOrder.captain_order_details.length > 3 && (
                <TableRow className="border-none">
                  <TableCell colSpan={3} className="px-0 text-qubu_blue">
                    <Link
                      href={`/pos/resto/patio/captain-order/${captainOrder.id}`}
                      className="flex w-full items-center justify-center"
                    >
                      <span>See Detail</span>
                      <ChevronDown size={20} />
                    </Link>
                  </TableCell>
                </TableRow>
              )}

              <TableRow className="border-none">
                <TableCell colSpan={2} className="px-0">
                  Tax
                </TableCell>
                <TableCell className="text-right">
                  {formatNumberToCurrency(Number(captainOrder.tax_amount))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>
            {formatNumberToCurrency(Number(captainOrder.grand_total))}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            className="w-full text-qubu_dark_gray hover:text-qubu_dark_gray"
            variant={"outline"}
            asChild
          >
            <Link href={`/pos/resto/patio/captain-order/${captainOrder.id}`}>
              See Detail
            </Link>
          </Button>

          {captainOrder.total_paid_qty < captainOrder.total_qty && (
            <Button className="w-full bg-qubu_blue" asChild>
              <Link
                href={`/pos/resto/patio/captain-order/${captainOrder.id}/edit`}
              >
                Pay Bills
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
