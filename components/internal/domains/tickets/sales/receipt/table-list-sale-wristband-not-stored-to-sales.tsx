import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumberToCurrency } from "@/lib/utils";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";
import { Sale } from "@/types/domains/tickets/sales/receipt";

export async function TableListSaleWristbandNotStoredToSales({
  sale,
  walletHistory,
}: {
  sale: Sale;
  walletHistory: {
    id: bigint;
    created_at: Date;
    updated_at: Date | null;
    amount: string;
    created_by: bigint;
    transaction_type: string;
    wallet_id: bigint;
    sale_id: bigint | null;
    wallet_cash_receive_id: bigint | null;
    prev_saldo: string;
    current_saldo: string;
    deposit_wristband_qty: number | null;
    walletCashReceive: { grand_total: string } | null;
  };
}) {
  const wristbandProductDescription = (await getWristbandProduct())
    .wristbandProduct?.description;

  return (
    <Table className="mt-8">
      <TableHeader>
        <TableRow className="border-none">
          <TableHead className="font-bold">Item</TableHead>
          <TableHead className="text-center font-bold">Qty</TableHead>
          <TableHead className="text-right font-bold">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sale.sales_details.map((detail, index) => {
          if (detail.product_description === wristbandProductDescription)
            return;
          return (
            <TableRow className="border-none" key={index}>
              <TableCell>{detail.product_description}</TableCell>
              <TableCell className="text-center">{detail.qty}</TableCell>
              <TableCell className="text-right">
                {formatNumberToCurrency(Number(detail.subtotal))}
              </TableCell>
            </TableRow>
          );
        })}
        <TableRow className="border-none">
          <TableCell>{"Gelang"}</TableCell>
          <TableCell className="text-center">
            {walletHistory.deposit_wristband_qty}
          </TableCell>
          <TableCell className="text-right">
            {formatNumberToCurrency(Number(walletHistory.amount))}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
