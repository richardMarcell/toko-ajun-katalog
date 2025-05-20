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
import { SwimmingClassCustomerHistoryIncludeRelations } from "@/types/domains/swimming-class/sales/create";
import { Edit } from "lucide-react";
import Link from "next/link";

export function TableListSwimmingClassCustomerHistory({
  swimmingClassCustomerHistory,
}: {
  swimmingClassCustomerHistory: SwimmingClassCustomerHistoryIncludeRelations;
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
            {swimmingClassCustomerHistory.swimmingClassCustomer.name}
          </TableCell>
          <TableCell>
            {formaterDate(swimmingClassCustomerHistory.registered_at, "date")}
          </TableCell>
          <TableCell>
            {formaterDate(swimmingClassCustomerHistory.valid_until, "date")}
          </TableCell>
          <TableCell>{swimmingClassCustomerHistory.product.name}</TableCell>
          <TableCell>
            {formatNumberToCurrency(
              Number(swimmingClassCustomerHistory.product.price),
            )}
          </TableCell>
          <TableCell className="flex justify-center">
            <Button asChild>
              <Link
                className="flex items-center justify-center"
                href={`/swimming-class/${swimmingClassCustomerHistory.sc_customer_id}/edit`}
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
