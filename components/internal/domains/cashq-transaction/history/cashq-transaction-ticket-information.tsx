import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumberToCurrency } from "@/lib/utils";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";

export type WalletGeneralInformation = {
  customer_name: string;
  customer_phone_number: string;
};

export async function CashqTransactionTicketInformation({
  cashqTransactionTicketList,
}: {
  cashqTransactionTicketList: {
    qty: number;
    subtotal: string;
    product: {
      description: string;
    };
  }[];
}) {
  const wristbandProductDescription = (await getWristbandProduct())
    .wristbandProduct?.description;

  const totalTicketTransactions = cashqTransactionTicketList
    .map((ticket) => {
      if (wristbandProductDescription === ticket.product.description) return 0;
      return Number(ticket.subtotal);
    })
    .reduce((total, ticketSubtotal) => total + ticketSubtotal, 0);

  const totalTicketQty = cashqTransactionTicketList
    .map((ticket) => {
      if (wristbandProductDescription === ticket.product.description) return 0;
      return Number(ticket.qty);
    })
    .reduce((total, qty) => total + qty, 0);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">TIPE</TableHead>
            <TableHead className="text-center font-semibold">QTY</TableHead>
            <TableHead className="text-right font-semibold">TOTAL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cashqTransactionTicketList.map(async (ticket, index) => {
            if (ticket.product.description === wristbandProductDescription)
              return;
            return (
              <TableRow key={index}>
                <TableCell>{ticket.product.description}</TableCell>
                <TableCell className="text-center">{ticket.qty}</TableCell>
                <TableCell className="text-right">
                  {Number(ticket.subtotal) === 0
                    ? "-"
                    : formatNumberToCurrency(Number(ticket.subtotal))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-semibold">{"Total"}</TableCell>
            <TableCell className="text-center font-semibold">
              {totalTicketQty}
            </TableCell>
            <TableCell className="text-right font-semibold">
              {formatNumberToCurrency(totalTicketTransactions)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
