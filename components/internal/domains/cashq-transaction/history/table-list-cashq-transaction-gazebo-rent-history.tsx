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
  GazeboTypeEnum,
  getGazeboDisplayType,
  getGazeboPrice,
} from "@/lib/enums/GazeboTypeEnum";
import {
  GazeboWalletReturnStatusEnum,
  getGazeboWalletReturnDisplayStatus,
} from "@/lib/enums/GazeboWalletReturnStatusEnum";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";

type CashQTransactionWithTypeTopUp = {
  id: bigint;
  return_status: string;
  created_at: Date;
  gazebo: { label: string; type: string } | null;
  user: { name: string } | null;
};

export function TableListCashqTransactionGazeboRentHistory({
  cashqTransactionWithTypeGazeboRentList,
}: {
  cashqTransactionWithTypeGazeboRentList: CashQTransactionWithTypeTopUp[];
}) {
  const cashqTrasactionGazeboRentWithPrice =
    cashqTransactionWithTypeGazeboRentList.map((gazeboRent) => ({
      ...gazeboRent,
      price: getGazeboPrice(gazeboRent.gazebo?.type as GazeboTypeEnum),
    }));

  const totalGazeboRentTransactions = cashqTrasactionGazeboRentWithPrice
    .map((gazeboRent) => gazeboRent.price)
    .reduce((total, gazeboPrice) => total + gazeboPrice, 0);

  return (
    <div className="space-y-2">
      <h3 className="font-bold">Transaksi Sewa Gazebo</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Tanggal & Waktu</TableHead>
            <TableHead>Kasir</TableHead>
            <TableHead>Gazebo</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Nominal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cashqTrasactionGazeboRentWithPrice.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-lg italic text-black"
              >
                Belum ada transaksi sewa loker
              </TableCell>
            </TableRow>
          )}

          {cashqTrasactionGazeboRentWithPrice.map((gazeboRent, index) => (
            <TableRow key={gazeboRent.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {formaterDate(gazeboRent.created_at, "dateTime")}
              </TableCell>
              <TableCell>{gazeboRent.user?.name}</TableCell>
              <TableCell>{gazeboRent.gazebo?.label ?? "-"}</TableCell>
              <TableCell>
                {getGazeboDisplayType(
                  gazeboRent.gazebo?.type as GazeboTypeEnum,
                )}
              </TableCell>
              <TableCell>
                {getGazeboWalletReturnDisplayStatus(
                  gazeboRent.return_status as GazeboWalletReturnStatusEnum,
                )}
              </TableCell>
              <TableCell className="text-right">
                {formatNumberToCurrency(gazeboRent.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-semibold" colSpan={6}>
              Total Sewa Gazebo
            </TableCell>
            <TableCell className="text-right font-semibold">
              {formatNumberToCurrency(totalGazeboRentTransactions)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
