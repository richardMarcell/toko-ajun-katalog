"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getOrderStatusDisplay,
  OrderStatusEnum,
} from "@/lib/enums/OrderStatusEnum";
import { formaterDate } from "@/lib/utils";
import { SalesDetail } from "@/types/domains/pos/food-corner/checker/list";

export default function TableListCheckerHistory({
  salesDetails,
}: {
  salesDetails: SalesDetail[];
}) {
  return (
    <div className="pt-4">
      <Table className="border-b border-b-gray-200">
        <TableHeader>
          <TableRow className="!border-b-2 border-b-gray-300 text-lg">
            <TableHead className="text-center font-bold text-black">
              #
            </TableHead>
            <TableHead className="font-bold text-black">Date & Time</TableHead>
            <TableHead className="font-bold text-black">Order ID</TableHead>
            <TableHead className="font-bold text-black">Order Status</TableHead>
            <TableHead className="font-bold text-black">Item</TableHead>
            <TableHead className="font-bold text-black">Notes</TableHead>
            <TableHead className="font-bold text-black">Qty</TableHead>
            <TableHead className="font-bold text-black">No. Meja</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesDetails.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-lg italic text-black"
              >
                Belum Ada Pesanan yang Masuk
              </TableCell>
            </TableRow>
          )}

          {salesDetails.map((detail, index) => {
            return (
              <TableRow
                key={detail.id}
                className={"text-base font-medium text-black"}
              >
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>
                  {formaterDate(detail.created_at, "dateTime")}
                </TableCell>
                <TableCell>{detail.order_number}</TableCell>
                <TableCell>
                  {getOrderStatusDisplay(
                    detail.order_status as OrderStatusEnum,
                  )}
                </TableCell>
                <TableCell>{detail.product_name}</TableCell>
                {/* TODO: add component hover to get more about note */}
                <TableCell>{detail.note ?? "-"}</TableCell>
                <TableCell>{detail.qty}</TableCell>
                <TableCell>{detail.table_number ?? "-"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
