"use client";

import { updateOrderStatus } from "@/app/(main)/pos/food-corner/checker/_actions/update-order-status";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrderTypeCase, OrderTypeEnum } from "@/lib/enums/OrderTypeEnum";
import { cn, formaterDate, removeDateTimezone } from "@/lib/utils";
import { SalesDetail } from "@/types/domains/pos/food-corner/checker/list";
import { differenceInMinutes } from "date-fns";
import { useState } from "react";

export default function TableListChecker({
  salesDetails,
}: {
  salesDetails: SalesDetail[];
}) {
  // TODO: make this page be realtime

  const [orderSelectedIds, setOrderSelectedIds] = useState<bigint[]>([]);
  const allOrderId = salesDetails.map(({ id }) => id);

  const currentTime = new Date();

  return (
    <div className="space-y-4 py-4">
      <div className="flex justify-end">
        <Button
          disabled={orderSelectedIds.length === 0}
          className="h-12 bg-qubu_checker_light_green text-lg hover:bg-qubu_checker_dark_green"
          onClick={() =>
            updateOrderStatus({
              salesDetailsIds: orderSelectedIds,
            })
          }
        >
          <span>Serve Selected</span>
        </Button>
      </div>
      <Table className="border-b border-b-gray-200">
        <TableHeader>
          <TableRow className="!border-b-2 border-b-gray-300 text-lg">
            <TableHead>
              <div className="flex items-center justify-center">
                <Checkbox
                  className="h-5 w-5"
                  disabled={salesDetails.length === 0}
                  checked={
                    salesDetails.length > 0 &&
                    salesDetails.length === orderSelectedIds.length
                  }
                  onCheckedChange={(value) => {
                    if (value) {
                      setOrderSelectedIds(allOrderId);
                    } else {
                      setOrderSelectedIds([]);
                    }
                  }}
                  aria-label="Select all"
                />
              </div>
            </TableHead>
            <TableHead className="font-bold text-black">Time</TableHead>
            <TableHead className="font-bold text-black">Order ID</TableHead>
            <TableHead className="font-bold text-black">Tipe Pesanan</TableHead>
            <TableHead className="font-bold text-black">Item</TableHead>
            <TableHead className="font-bold text-black">Notes</TableHead>
            <TableHead className="font-bold text-black">Qty</TableHead>
            <TableHead className="font-bold text-black">No. Meja</TableHead>
            <TableHead className="font-bold text-black">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesDetails.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center text-lg italic text-black"
              >
                Belum Ada Pesanan yang Masuk
              </TableCell>
            </TableRow>
          )}

          {salesDetails.map((detail) => {
            const isOverdue = differenceInMinutes(
              currentTime,
              removeDateTimezone(detail.created_at),
            );

            return (
              <TableRow
                key={detail.id}
                className={cn(
                  "text-base font-medium text-black",
                  isOverdue > 30
                    ? "bg-qubu_checker_light_red hover:bg-qubu_checker_dark_red"
                    : isOverdue > 15
                      ? "bg-qubu_checker_light_yellow hover:bg-qubu_checker_dark_yellow"
                      : "",
                )}
              >
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Checkbox
                      className="h-5 w-5"
                      checked={
                        orderSelectedIds.find((id) => id === detail.id) !==
                        undefined
                      }
                      onCheckedChange={(value) => {
                        if (value) {
                          setOrderSelectedIds([...orderSelectedIds, detail.id]);
                        } else {
                          setOrderSelectedIds(
                            orderSelectedIds.filter((id) => id !== detail.id),
                          );
                        }
                      }}
                      aria-label="Select row"
                    />
                  </div>
                </TableCell>
                <TableCell>{formaterDate(detail.created_at, "time")}</TableCell>
                <TableCell>{detail.order_number}</TableCell>
                <TableCell>
                  {getOrderTypeCase(detail.type_order as OrderTypeEnum)}
                </TableCell>
                <TableCell>{detail.product_name}</TableCell>
                {/* TODO: add component hover to get more about note */}
                <TableCell>{detail.note ?? "-"}</TableCell>
                <TableCell>{detail.qty}</TableCell>
                <TableCell>{detail.table_number ?? "-"}</TableCell>
                <TableCell>
                  <Button
                    className="bg-qubu_checker_light_green text-lg hover:bg-qubu_checker_dark_green"
                    onClick={() =>
                      updateOrderStatus({
                        salesDetailsIds: [detail.id],
                      })
                    }
                  >
                    <span>Serve</span>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
