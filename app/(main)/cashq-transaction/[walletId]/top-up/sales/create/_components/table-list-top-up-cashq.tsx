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
import { Edit } from "lucide-react";
import Link from "next/link";

type TopUpCashQTemporaryType = {
  amount: number;
  current_saldo: number;
  wristband_code: string;
};

export default function TableListTopUpCashQ({
  topUpCashQTemporary,
  walletId,
}: {
  topUpCashQTemporary: TopUpCashQTemporaryType;
  walletId: string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Tanggal & Waktu</TableHead>
          <TableHead>Kode Gelang</TableHead>
          <TableHead>Top-Up Saldo</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!topUpCashQTemporary ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center text-lg italic text-black"
            >
              Belum Ada produk yang Didaftarkan
            </TableCell>
          </TableRow>
        ) : (
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>{formaterDate(getCurrentDate(), "dateTime")}</TableCell>
            <TableCell>{topUpCashQTemporary.wristband_code}</TableCell>
            <TableCell>
              {formatNumberToCurrency(Number(topUpCashQTemporary.amount))}
            </TableCell>
            <TableCell className="flex items-center justify-center gap-2">
              <Button asChild>
                <Link
                  href={`/cashq-transaction/${walletId}/top-up`}
                  className="flex gap-2"
                >
                  <Edit />
                  <span>Edit</span>
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
