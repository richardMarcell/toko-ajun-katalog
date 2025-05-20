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
import { EntryPassCustomer } from "@/types/domains/entry-pass/list";
import { Banknote, Edit } from "lucide-react";
import Link from "next/link";

export function TableListEntryPassCustomer({
  entryPassCustomers,
  isUserAuthorizeToMakePayment,
}: {
  entryPassCustomers: EntryPassCustomer[];
  isUserAuthorizeToMakePayment: boolean;
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
        {entryPassCustomers.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center text-lg italic text-black"
            >
              Belum Ada Customer yang Didaftarkan
            </TableCell>
          </TableRow>
        )}
        {entryPassCustomers.map((entryPassCustomer, index) => {
          return (
            <TableRow key={entryPassCustomer.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{entryPassCustomer.name}</TableCell>
              <TableCell>
                {formaterDate(entryPassCustomer.registered_at, "date")}
              </TableCell>
              <TableCell>
                {formaterDate(entryPassCustomer.valid_until, "date")}
              </TableCell>
              <TableCell>{entryPassCustomer.product_name}</TableCell>
              <TableCell>
                {formatNumberToCurrency(Number(entryPassCustomer.price))}
              </TableCell>
              <TableCell className="flex items-center justify-center gap-2">
                <Button asChild>
                  <Link
                    href={`/entry-pass/${entryPassCustomer.id}/edit`}
                    className="flex gap-2"
                  >
                    <Edit />
                    <span>Edit</span>
                  </Link>
                </Button>
                {isUserAuthorizeToMakePayment && (
                  <Button
                    asChild
                    className={cn(
                      "cursor-pointer bg-qubu_green",
                      !entryPassCustomer.can_make_payment
                        ? "pointer-events-none opacity-70"
                        : "",
                    )}
                  >
                    <Link
                      href={`/entry-pass/sales/create?entryPassCustomerHistoryId=${Number(entryPassCustomer.entry_pass_customer_history_id)}`}
                      className={cn("flex gap-2")}
                    >
                      <Banknote />
                      <span>Bayar</span>
                    </Link>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
