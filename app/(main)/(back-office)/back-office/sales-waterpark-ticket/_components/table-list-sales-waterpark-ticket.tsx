import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getPaymentMethodCase,
  PaymentMethodEnum,
} from "@/lib/enums/PaymentMethodEnum";
import { formaterDate } from "@/lib/utils";
import { SaleIncludeRelationship } from "../_repositories/get-sales-waterpark-ticket";

export default function TableListSalesWaterparkTicket({
  sales,
  offset,
}: {
  sales: SaleIncludeRelationship[];
  offset: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[48px]">#</TableHead>
          <TableHead className="w-[320px]">ID</TableHead>
          <TableHead className="w-[200px]">ALT</TableHead>
          <TableHead className="w-[200px]">Date</TableHead>
          <TableHead className="w-[200px]">Nama</TableHead>
          <TableHead className="w-[200px]">Payment</TableHead>
          <TableHead className="w-[200px] text-right">Total</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale, index) => {
          const totalSalesTicket = sale.salesDetails.reduce(
            (sum, saleDetail) => sum + saleDetail.qty,
            0,
          );

          const paymentMethod = sale.payments
            .map((payment) =>
              getPaymentMethodCase(payment.payment_method as PaymentMethodEnum),
            )
            .join(", ");

          return (
            <TableRow key={sale.id}>
              <TableCell>{offset + index + 1}</TableCell>
              <TableCell>{sale.code}</TableCell>
              {/* TODO: fill with value relate with ALT. waiting information about ALT */}
              <TableCell></TableCell>
              <TableCell>{formaterDate(sale.created_at, "date")}</TableCell>
              <TableCell>{sale.salesTicket?.customer_name}</TableCell>
              <TableCell>{paymentMethod}</TableCell>
              <TableCell className="text-right">{totalSalesTicket}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableCaption>Daftar gentrance aplikasi Qubu Satellite</TableCaption>
    </Table>
  );
}
