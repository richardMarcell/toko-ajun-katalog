import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";

type CashQTransactionWithTypeTopUp = {
  id: bigint;
  amount: string;
  created_at: Date;
  user: {
    name: string;
  };
};

export function TableListCashqTransactionTopUpHistory({
  cashqTransactionWithTypeTopUpList,
}: {
  cashqTransactionWithTypeTopUpList: CashQTransactionWithTypeTopUp[];
}) {
  const totalTopUpTransactions = cashqTransactionWithTypeTopUpList
    .map((topUp) => Number(topUp.amount))
    .reduce((total, topUpAmount) => total + topUpAmount, 0);

  return (
    <div className="space-y-2">
      <h3 className="font-bold">Transaksi Top Up</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Tanggal & Waktu</TableHead>
            <TableHead>Kasir</TableHead>
            <TableHead className="text-right">Nominal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cashqTransactionWithTypeTopUpList.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-lg italic text-black"
              >
                Belum ada transaksi top up
              </TableCell>
            </TableRow>
          )}

          {cashqTransactionWithTypeTopUpList.map((topUp, index) => (
            <TableRow key={topUp.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {formaterDate(topUp.created_at, "dateTime")}
              </TableCell>
              <TableCell>{topUp.user.name}</TableCell>
              <TableCell className="text-right">
                {formatNumberToCurrency(Number(topUp.amount))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-semibold" colSpan={3}>
              Total Top Up
            </TableCell>
            <TableCell className="text-right font-semibold">
              {formatNumberToCurrency(totalTopUpTransactions)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
