import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { EntryPassCustomerWithHistories } from "@/types/domains/entry-pass/edit";
import { Banknote } from "lucide-react";
import Link from "next/link";

export function TableListCustomerEntryPassPaymentHistories({
  entryPassCustomer,
}: {
  entryPassCustomer: EntryPassCustomerWithHistories;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Tanggal Pendaftaran</TableHead>
          <TableHead>Tanggal Valid</TableHead>
          <TableHead>Tipe</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {entryPassCustomer.entryPassCustomerHistories.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center text-lg italic text-black"
            >
              Belum Ada Riwayat Pembayaran
            </TableCell>
          </TableRow>
        )}
        {entryPassCustomer.entryPassCustomerHistories.map((history, index) => {
          const isEntryPassPaid = history.sales_id != null;
          return (
            <TableRow key={history.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{entryPassCustomer.name}</TableCell>
              <TableCell>
                {formaterDate(history.registered_at, "date")}
              </TableCell>
              <TableCell>{formaterDate(history.valid_until, "date")}</TableCell>
              <TableCell>{history.product.name}</TableCell>
              <TableCell>
                {formatNumberToCurrency(Number(history.product.price))}
              </TableCell>
              <TableCell className="flex justify-center">
                <Button
                  asChild
                  className={cn(
                    "cursor-pointer bg-qubu_green",
                    isEntryPassPaid ? "pointer-events-none opacity-70" : "",
                  )}
                >
                  <Link
                    href={`/entry-pass/sales/create?entryPassCustomerHistoryId=${Number(history.id)}`}
                    className={cn("flex gap-2")}
                  >
                    <Banknote />
                    <span>Bayar</span>
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
