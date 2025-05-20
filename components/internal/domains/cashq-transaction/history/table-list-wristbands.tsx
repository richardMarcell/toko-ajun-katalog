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
  getWalletWristbandReturnDisplayStatus,
  WalletWristbandReturnStatusEnum,
} from "@/lib/enums/WalletWristbandReturnStatusEnum";
import { formatNumberToCurrency } from "@/lib/utils";

type CashQTransactionWristbandList = {
  wristband_code: string;
  return_status: string;
};

export function TableListWristbands({
  cashqTransactionWristbandList,
  totalDepositAmount,
}: {
  cashqTransactionWristbandList: CashQTransactionWristbandList[];
  totalDepositAmount: number;
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-bold">Transaksi Deposit</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>CashQ Code</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Deposit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cashqTransactionWristbandList.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-lg italic text-black"
              >
                Belum ada gelang yang terdaftar
              </TableCell>
            </TableRow>
          )}

          {cashqTransactionWristbandList.map((wristband, index) => (
            <TableRow key={wristband.wristband_code}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{wristband.wristband_code}</TableCell>
              <TableCell className="text-center">
                {getWalletWristbandReturnDisplayStatus(
                  wristband.return_status as WalletWristbandReturnStatusEnum,
                )}
              </TableCell>
              <TableCell className="text-right">
                {formatNumberToCurrency(25000)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="font-semibold">
              Total Deposit
            </TableCell>
            <TableCell className="text-right font-semibold">
              {formatNumberToCurrency(totalDepositAmount)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
