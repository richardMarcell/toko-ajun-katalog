import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getSwimsuitRentReturnStatusCase,
  SwimsuitRentReturnStatusEnum,
} from "@/lib/enums/SwimsuitRentReturnStatusEnum";

import { cn, formaterDate, formatNumberToCurrency } from "@/lib/utils";

type CashQTransactionWithTypeTopUp = {
  id: bigint;
  return_status: string;
  created_at: Date;
  saleDetail: {
    qty: number;
    subtotal: string;
    product: { name: string; price: string };
  };
  // user: { name: string } | null;
};

export function TableListCashqTransactionSwimsuitRentHistory({
  cashqTransactionWithTypeSwimsuitRentList,
}: {
  cashqTransactionWithTypeSwimsuitRentList: CashQTransactionWithTypeTopUp[];
}) {
  const totalSwimsuitRentTransactions = cashqTransactionWithTypeSwimsuitRentList
    .map((swimsuitRent) => Number(swimsuitRent.saleDetail.subtotal))
    .reduce((total, swimsuitSubtotal) => total + swimsuitSubtotal, 0);

  return (
    <div className="space-y-2">
      <h3 className="font-bold">Transaksi Sewa Baju Renang</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Tanggal & Waktu</TableHead>
            {/* <TableHead>Kasir</TableHead> */}
            <TableHead>Produk</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Harga Satuan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total Nominal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cashqTransactionWithTypeSwimsuitRentList.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-lg italic text-black"
              >
                Tidak ada baju renang yang disewa
              </TableCell>
            </TableRow>
          ) : (
            cashqTransactionWithTypeSwimsuitRentList.map(
              (swimsuitRent, index) => (
                <TableRow key={swimsuitRent.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {formaterDate(swimsuitRent.created_at, "dateTime")}
                  </TableCell>
                  <TableCell>{swimsuitRent.saleDetail.product.name}</TableCell>
                  <TableCell>{swimsuitRent.saleDetail.qty}</TableCell>
                  <TableCell>
                    {formatNumberToCurrency(
                      Number(swimsuitRent.saleDetail.product.price),
                    )}
                  </TableCell>
                  <TableCell
                    className={cn(
                      swimsuitRent.return_status ===
                        SwimsuitRentReturnStatusEnum.NOT_RETURNED
                        ? "text-red-500"
                        : "text-green-600",
                    )}
                  >
                    {getSwimsuitRentReturnStatusCase(
                      swimsuitRent.return_status as SwimsuitRentReturnStatusEnum,
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumberToCurrency(
                      Number(swimsuitRent.saleDetail.subtotal),
                    )}
                  </TableCell>
                </TableRow>
              ),
            )
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableHead className="font-semibold text-black" colSpan={6}>
              Total Sewa Baju Renang
            </TableHead>
            <TableHead className="text-right text-black last:font-semibold">
              {formatNumberToCurrency(totalSwimsuitRentTransactions)}
            </TableHead>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
