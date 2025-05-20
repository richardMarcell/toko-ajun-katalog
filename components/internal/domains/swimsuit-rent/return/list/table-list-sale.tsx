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
  getSwimsuitRentReturnStatusCase,
  SwimsuitRentReturnStatusEnum,
} from "@/lib/enums/SwimsuitRentReturnStatusEnum";

import { cn, formaterDate } from "@/lib/utils";
import { Sale } from "@/types/domains/swimsuit-rent/return/list";
import { Eye } from "lucide-react";
import Link from "next/link";

export function TableListSale({ sales }: { sales: Sale[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Tanggal & Waktu</TableHead>
          <TableHead>Faktur</TableHead>
          <TableHead>Kode Gelang</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>No. Hp</TableHead>
          <TableHead>Item Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={8}
              className="text-center text-lg italic text-black"
            >
              Belum Ada Transaksi Hari Ini
            </TableCell>
          </TableRow>
        )}
        {sales.map((sale, index) => {
          return (
            <TableRow key={sale.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{formaterDate(sale.created_at, "dateTime")}</TableCell>
              <TableCell>{sale.code}</TableCell>
              <TableCell>{sale.wristband_code}</TableCell>
              <TableCell>{sale.customer_name}</TableCell>
              <TableCell>{sale.customer_phone_number}</TableCell>
              <TableCell>
                {sale.is_has_item_not_returned ? (
                  <span className="italic text-qubu_red">
                    {getSwimsuitRentReturnStatusCase(
                      SwimsuitRentReturnStatusEnum.NOT_RETURNED,
                    )}
                  </span>
                ) : (
                  <span className="italic text-qubu_green">
                    {getSwimsuitRentReturnStatusCase(
                      SwimsuitRentReturnStatusEnum.HAS_RETURNED,
                    )}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Button asChild>
                  <Link
                    className={cn(
                      "flex items-center justify-center",
                      !sale.is_has_item_not_returned
                        ? "pointer-events-none opacity-70"
                        : "",
                    )}
                    href={`/swimsuit-rent/return/${sale.id}`}
                  >
                    <Eye />
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
