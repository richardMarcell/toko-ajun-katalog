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
  getLockerDisplayType,
  getLockerPrice,
  LockerTypeEnum,
} from "@/lib/enums/LockerTypeEnum";
import {
  getLockerWalletReturnDisplayStatus,
  LockerWalletReturnStatusEnum,
} from "@/lib/enums/LockerWalletReturnStatusEnum";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";

type CashQTransactionWithTypeTopUp = {
  id: bigint;
  return_status: string;
  created_at: Date;
  locker: { label: string; type: string } | null;
  user: { name: string } | null;
};

export function TableListCashqTransactionLockerRentHistory({
  cashqTransactionWithTypeLockerRentList,
}: {
  cashqTransactionWithTypeLockerRentList: CashQTransactionWithTypeTopUp[];
}) {
  const cashqTrasactionLockerRentWithPrice =
    cashqTransactionWithTypeLockerRentList.map((lockerRent) => ({
      ...lockerRent,
      price: getLockerPrice(lockerRent.locker?.type as LockerTypeEnum),
    }));

  const totalLockerRentTransactions = cashqTrasactionLockerRentWithPrice
    .map((lockerRent) => lockerRent.price)
    .reduce((total, lockerPrice) => total + lockerPrice, 0);

  return (
    <div className="space-y-2">
      <h3 className="font-bold">Transaksi Sewa Locker</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Tanggal & Waktu</TableHead>
            <TableHead>Kasir</TableHead>
            <TableHead>Loker</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Nominal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cashqTrasactionLockerRentWithPrice.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-lg italic text-black"
              >
                Belum ada transaksi sewa loker
              </TableCell>
            </TableRow>
          )}

          {cashqTrasactionLockerRentWithPrice.map((lockerRent, index) => (
            <TableRow key={lockerRent.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {formaterDate(lockerRent.created_at, "dateTime")}
              </TableCell>
              <TableCell>{lockerRent.user?.name ?? "-"}</TableCell>
              <TableCell>{lockerRent.locker?.label ?? "-"}</TableCell>
              <TableCell>
                {getLockerDisplayType(
                  lockerRent.locker?.type as LockerTypeEnum,
                )}
              </TableCell>
              <TableCell>
                {getLockerWalletReturnDisplayStatus(
                  lockerRent.return_status as LockerWalletReturnStatusEnum,
                )}
              </TableCell>
              <TableCell className="text-right">
                {formatNumberToCurrency(lockerRent.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-semibold" colSpan={6}>
              Total Sewa Loker
            </TableCell>
            <TableCell className="text-right font-semibold">
              {formatNumberToCurrency(totalLockerRentTransactions)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
