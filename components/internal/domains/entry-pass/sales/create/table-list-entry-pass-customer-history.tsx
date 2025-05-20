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
import { EntryPassCustomerHistoryIncludeRelations } from "@/types/domains/entry-pass/sales/create";
import { Edit } from "lucide-react";
import Link from "next/link";

export function TableListEntryPassCustomerHistory({
  entryPassCustomerHistory,
}: {
  entryPassCustomerHistory: EntryPassCustomerHistoryIncludeRelations;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Tanggal Pendafataran</TableHead>
          <TableHead>Tanggal Valid</TableHead>
          <TableHead>Tipe</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>
            {entryPassCustomerHistory.entryPassCustomer.name}
          </TableCell>
          <TableCell>
            {formaterDate(entryPassCustomerHistory.registered_at, "date")}
          </TableCell>
          <TableCell>
            {formaterDate(entryPassCustomerHistory.valid_until, "date")}
          </TableCell>
          <TableCell>{entryPassCustomerHistory.product.name}</TableCell>
          <TableCell>
            {formatNumberToCurrency(
              Number(entryPassCustomerHistory.product.price),
            )}
          </TableCell>
          <TableCell className="flex justify-center">
            <Button asChild>
              <Link
                className="flex items-center justify-center"
                href={`/entry-pass/${entryPassCustomerHistory.ep_customer_id}/edit`}
              >
                <Edit />
                <span>Edit</span>
              </Link>
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
