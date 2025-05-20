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
import { WristbandRentTemporaryType } from "@/types/domains/wristband-rent/general";
import { Edit } from "lucide-react";
import Link from "next/link";

export default function TableListWristbandRent({
  wristbandRentTemporary,
}: {
  wristbandRentTemporary: WristbandRentTemporaryType;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Tanggal & Waktu</TableHead>
          <TableHead>Kode Gelang</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>No. HP</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Saldo</TableHead>
          <TableHead>Deposit</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!wristbandRentTemporary ? (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center text-lg italic text-black"
            >
              Belum Ada produk yang Didaftarkan
            </TableCell>
          </TableRow>
        ) : (
          <TableRow>
            <TableCell>{1}</TableCell>
            <TableCell>{formaterDate(getCurrentDate(), "dateTime")}</TableCell>
            <TableCell>
              {wristbandRentTemporary.wristband_rent_code.join(", ")}
            </TableCell>
            <TableCell>{wristbandRentTemporary.customer_name}</TableCell>
            <TableCell>
              {wristbandRentTemporary.customer_phone_number}
            </TableCell>
            <TableCell>{wristbandRentTemporary.quantity}</TableCell>
            <TableCell>
              {formatNumberToCurrency(wristbandRentTemporary.saldo)}
            </TableCell>
            <TableCell>
              {formatNumberToCurrency(wristbandRentTemporary.deposit_amount)}
            </TableCell>
            <TableCell className="flex items-center justify-center gap-2">
              <Button asChild>
                <Link href={`/wristband-rent/create`} className="flex gap-2">
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
