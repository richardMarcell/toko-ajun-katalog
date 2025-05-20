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
import { SwimmingClassCustomer } from "@/types/domains/swimming-class/list";
import { Banknote, Edit } from "lucide-react";
import Link from "next/link";

export function TableListSwimmingClassCustomer({
  swimmingClassCustomers,
}: {
  swimmingClassCustomers: SwimmingClassCustomer[];
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
        {swimmingClassCustomers.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center text-lg italic text-black"
            >
              Belum Ada Customer yang Didaftarkan
            </TableCell>
          </TableRow>
        )}
        {swimmingClassCustomers.map((swimmingClassCustomer, index) => {
          return (
            <TableRow key={swimmingClassCustomer.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{swimmingClassCustomer.name}</TableCell>
              <TableCell>
                {formaterDate(swimmingClassCustomer.registered_at, "date")}
              </TableCell>
              <TableCell>
                {formaterDate(swimmingClassCustomer.valid_until, "date")}
              </TableCell>
              <TableCell>{swimmingClassCustomer.product_name}</TableCell>
              <TableCell>
                {formatNumberToCurrency(Number(swimmingClassCustomer.price))}
              </TableCell>
              <TableCell className="flex items-center justify-center gap-2">
                <Button asChild>
                  <Link
                    href={`/swimming-class/${swimmingClassCustomer.id}/edit`}
                    className="flex gap-2"
                  >
                    <Edit />
                    <span>Edit</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  className={cn(
                    "cursor-pointer bg-qubu_green",
                    !swimmingClassCustomer.can_make_payment
                      ? "pointer-events-none opacity-70"
                      : "",
                  )}
                >
                  <Link
                    href={`/swimming-class/sales/create?swimmingClassCustomerHistoryId=${Number(swimmingClassCustomer.swimming_class_customer_history_id)}`}
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
