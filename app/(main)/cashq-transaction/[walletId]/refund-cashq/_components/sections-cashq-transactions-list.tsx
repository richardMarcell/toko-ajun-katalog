import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GazeboTypeEnum,
  getGazeboDisplayType,
} from "@/lib/enums/GazeboTypeEnum";
import {
  GazeboWalletReturnStatusEnum,
  getGazeboWalletReturnDisplayStatus,
} from "@/lib/enums/GazeboWalletReturnStatusEnum";
import {
  getLockerDisplayType,
  LockerTypeEnum,
} from "@/lib/enums/LockerTypeEnum";
import {
  getLockerWalletReturnDisplayStatus,
  LockerWalletReturnStatusEnum,
} from "@/lib/enums/LockerWalletReturnStatusEnum";
import {
  getSwimsuitRentReturnStatusCase,
  SwimsuitRentReturnStatusEnum,
} from "@/lib/enums/SwimsuitRentReturnStatusEnum";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function SectionCashQTransactionsList({
  wallet,
}: {
  wallet: {
    id: bigint;
    created_at: Date;
    updated_at: Date | null;
    code: string | null;
    customer_name: string;
    customer_phone_number: string;
    deposit_payment_method: string | null;
    deposit_amount: string;
    saldo: string;
    status: string;
    lockerWallets: {
      id: bigint;
      type: string;
      return_status: string | null;
      locker: {
        label: string;
      } | null;
    }[];
    gazeboWallets: {
      id: bigint;
      type: string;
      return_status: string | null;
      gazebo: {
        label: string;
      } | null;
    }[];
    swimsuitRentWallet: {
      id: bigint;
      return_status: string | null;
      saleDetail: {
        sales_id: bigint;
        qty: number;
        product: {
          name: string;
        };
      };
    }[];
  };
}) {
  const isRentSwimsuit = wallet.swimsuitRentWallet.length > 0;
  return (
    <div>
      <h2 className="text-lg font-bold">Daftar Transaksi CashQ</h2>

      <div className="space-y-6">
        <div>
          <p>Sewa Baju Renang</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-black">#</TableHead>
                <TableHead className="font-bold text-black">Produk</TableHead>
                <TableHead className="font-bold text-black">Qty</TableHead>
                <TableHead className="font-bold text-black">Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isRentSwimsuit ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-lg italic text-black"
                  >
                    Tidak ada baju renang yang disewa
                  </TableCell>
                </TableRow>
              ) : (
                wallet.swimsuitRentWallet.map((swimsuitRentWallet, index) => (
                  <TableRow key={swimsuitRentWallet.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {swimsuitRentWallet.saleDetail.product.name}
                    </TableCell>
                    <TableCell>{swimsuitRentWallet.saleDetail.qty}</TableCell>
                    <TableCell
                      className={cn(
                        "font-bold",
                        swimsuitRentWallet.return_status ===
                          SwimsuitRentReturnStatusEnum.NOT_RETURNED
                          ? "text-red-500"
                          : "text-green-600",
                      )}
                    >
                      {getSwimsuitRentReturnStatusCase(
                        swimsuitRentWallet.return_status as SwimsuitRentReturnStatusEnum,
                      )}
                    </TableCell>
                    <TableCell>
                      {swimsuitRentWallet.return_status ===
                        SwimsuitRentReturnStatusEnum.NOT_RETURNED && (
                        <Button asChild>
                          <Link
                            href={`/swimsuit-rent/return/${swimsuitRentWallet.saleDetail.sales_id}`}
                          >
                            Kembalikan
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div>
          <p>Status Loker</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-black">#</TableHead>
                <TableHead className="font-bold text-black">Loker</TableHead>
                <TableHead className="font-bold text-black">Type</TableHead>
                <TableHead className="font-bold text-black">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wallet.lockerWallets.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-lg italic text-black"
                  >
                    Tidak ada loker yang disewa
                  </TableCell>
                </TableRow>
              ) : (
                wallet.lockerWallets.map((lockerWallet, index) => (
                  <TableRow key={lockerWallet.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{lockerWallet.locker?.label ?? "-"}</TableCell>
                    <TableCell>
                      {getLockerDisplayType(
                        lockerWallet.type as LockerTypeEnum,
                      )}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "font-bold",
                        lockerWallet.return_status ===
                          LockerWalletReturnStatusEnum.NOT_RETURNED
                          ? "text-red-500"
                          : "text-green-600",
                      )}
                    >
                      {getLockerWalletReturnDisplayStatus(
                        lockerWallet.return_status as LockerWalletReturnStatusEnum,
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div>
          <p>Status Gazebo</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-black">#</TableHead>
                <TableHead className="font-bold text-black">Gazebo</TableHead>
                <TableHead className="font-bold text-black">Type</TableHead>
                <TableHead className="font-bold text-black">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wallet.gazeboWallets.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-lg italic text-black"
                  >
                    Tidak ada gazebo yang disewa
                  </TableCell>
                </TableRow>
              ) : (
                wallet.gazeboWallets.map((gazeboWallet, index) => (
                  <TableRow key={gazeboWallet.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{gazeboWallet.gazebo?.label ?? "-"}</TableCell>
                    <TableCell>
                      {getGazeboDisplayType(
                        gazeboWallet.type as GazeboTypeEnum,
                      )}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "font-bold",
                        gazeboWallet.return_status ===
                          GazeboWalletReturnStatusEnum.NOT_RETURNED
                          ? "text-red-500"
                          : "text-green-600",
                      )}
                    >
                      {getGazeboWalletReturnDisplayStatus(
                        gazeboWallet.return_status as GazeboWalletReturnStatusEnum,
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
