import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { wallets, walletWristband } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SwimsuitRentReturnStatusEnum } from "@/lib/enums/SwimsuitRentReturnStatusEnum";
import {
  getWalletWristbandReturnDisplayStatus,
  WalletWristbandReturnStatusEnum,
} from "@/lib/enums/WalletWristbandReturnStatusEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { cn, formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";
import { Product } from "@/types/product";
import { and, eq } from "drizzle-orm";
import { Check, Slash, X } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import GroupButtonRefundDepositAndSaldo from "./_components/group-button-refund-deposit-and-saldo";
import ModalReturnWristband from "./_components/modal-return-wristband";
import SectionCashQTransactionsList from "./_components/sections-cashq-transactions-list";

export default async function RefundCashQIndexPage({
  params,
}: {
  params: Promise<{ walletId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_SHOW],
    user: user,
  });

  const { walletId } = await params;

  const wallet = await db.query.wallets.findFirst({
    with: {
      lockerWallets: {
        columns: {
          id: true,
          type: true,
          return_status: true,
        },
        with: {
          locker: {
            columns: {
              label: true,
            },
          },
        },
      },
      gazeboWallets: {
        columns: {
          id: true,
          type: true,
          return_status: true,
        },
        with: {
          gazebo: {
            columns: {
              label: true,
            },
          },
        },
      },
      swimsuitRentWallet: {
        columns: {
          id: true,
          return_status: true,
        },
        with: {
          saleDetail: {
            columns: {
              sales_id: true,
              qty: true,
            },
            with: {
              product: {
                columns: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    where: eq(wallets.id, BigInt(walletId)),
  });

  if (!wallet) return notFound();

  const { wristbandProduct } = await getWristbandProduct();

  if (!wristbandProduct) {
    console.error("Product wristband is not found");
    return notFound();
  }

  const isRentSwimsuit = wallet.swimsuitRentWallet.length > 0;
  const isSwimsuitReturned = wallet.swimsuitRentWallet.some(
    ({ return_status }) =>
      return_status === SwimsuitRentReturnStatusEnum.HAS_RETURNED,
  );

  const walletWristbandsList = await db.query.walletWristband.findMany({
    columns: {
      id: true,
      created_at: true,
      return_status: true,
      wristband_code: true,
      is_deposit_wristband_returned: true,
    },
    where: eq(walletWristband.wallet_id, BigInt(walletId)),
  });

  const walletWristbandsRentedList = await db.query.walletWristband.findMany({
    columns: {
      id: true,
      created_at: true,
      return_status: true,
      wristband_code: true,
    },
    where: and(
      eq(walletWristband.wallet_id, BigInt(walletId)),
      eq(walletWristband.return_status, WalletWristbandReturnStatusEnum.RENTED),
    ),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="text-2xl">Refund CashQ</h1>
        </CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent>
        <div className="space-y-6 pt-8">
          <TableWallet
            walletId={BigInt(walletId)}
            isRentSwimsuit={isRentSwimsuit}
            isSwimsuitReturned={isSwimsuitReturned}
          />

          <TableWristbandRent
            walletId={BigInt(walletId)}
            walletWristbandsList={walletWristbandsList}
            walletWristbandsRentedList={walletWristbandsRentedList}
            wristbandProduct={wristbandProduct}
          />

          <SectionCashQTransactionsList wallet={wallet} />
        </div>
      </CardContent>
    </Card>
  );
}

async function TableWallet({
  walletId,
  isRentSwimsuit,
  isSwimsuitReturned,
}: {
  walletId: bigint;
  isRentSwimsuit: boolean;
  isSwimsuitReturned: boolean;
}) {
  const wallet = await db.query.wallets.findFirst({
    with: {
      walletWristbands: true,
    },
    where: eq(wallets.id, walletId),
  });

  if (!wallet) return notFound();

  const totalWristbandRented = wallet.walletWristbands.filter(
    (walletWristband) =>
      walletWristband.return_status === WalletWristbandReturnStatusEnum.RENTED,
  ).length;

  const totalWristbandHasReturned = wallet.walletWristbands.filter(
    (walletWristband) =>
      walletWristband.return_status ===
      WalletWristbandReturnStatusEnum.HAS_RETURNED,
  ).length;

  const totalWristbandNotReturned = wallet.walletWristbands.filter(
    (walletWristband) =>
      walletWristband.return_status ===
      WalletWristbandReturnStatusEnum.NOT_RETURNED,
  ).length;

  return (
    <Table>
      <TableHeader>
        <TableRow className="">
          <TableHead className="font-bold text-black">#</TableHead>
          <TableHead className="font-bold text-black">
            Tanggal & Waktu
          </TableHead>
          <TableHead className="font-bold text-black">Nama</TableHead>
          <TableHead className="font-bold text-black">No. Hp</TableHead>
          <TableHead className="font-bold text-black">Gelang</TableHead>
          <TableHead className="font-bold text-black">Sisa Saldo</TableHead>
          <TableHead className="font-bold text-black">Deposit</TableHead>
          <TableHead className="font-bold text-black">Status</TableHead>
          <TableHead className="text-center font-bold text-black">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>{formaterDate(wallet.created_at, "dateTime")}</TableCell>
          <TableCell>{wallet.customer_name}</TableCell>
          <TableCell>{wallet.customer_phone_number}</TableCell>
          <TableCell>
            {wallet.walletWristbands
              .map(
                (walletWristband) =>
                  "#" + walletWristband.id.toString(10).padStart(6, "0"),
              )
              .join(", ")}
          </TableCell>
          <TableCell>{formatNumberToCurrency(Number(wallet.saldo))}</TableCell>
          <TableCell>
            {formatNumberToCurrency(Number(wallet.deposit_amount))}
          </TableCell>
          <TableCell>
            <div>
              <p className="font-bold text-blue-500">
                {totalWristbandRented +
                  " " +
                  getWalletWristbandReturnDisplayStatus(
                    WalletWristbandReturnStatusEnum.RENTED,
                  )}
              </p>
              <p className="font-bold text-green-600">
                {totalWristbandHasReturned +
                  " " +
                  getWalletWristbandReturnDisplayStatus(
                    WalletWristbandReturnStatusEnum.HAS_RETURNED,
                  )}
              </p>
              <p className="font-bold text-red-500">
                {totalWristbandNotReturned +
                  " " +
                  getWalletWristbandReturnDisplayStatus(
                    WalletWristbandReturnStatusEnum.NOT_RETURNED,
                  )}
              </p>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex justify-center gap-4">
              <ModalReturnWristband
                walletId={wallet.id}
                // NOTE: just send wristband code with wallet wristband return status value "NOT RETURNED"
                wristbandRentedCodes={wallet.walletWristbands
                  .map((walletWristband) => {
                    if (
                      walletWristband.return_status ===
                      WalletWristbandReturnStatusEnum.RENTED
                    )
                      return walletWristband.wristband_code;
                    else return undefined;
                  })
                  .filter((code): code is string => !!code)}
                isRentSwimsuit={isRentSwimsuit}
                isSwimsuitReturned={isSwimsuitReturned}
              />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function TableWristbandRent({
  walletId,
  walletWristbandsList,
  walletWristbandsRentedList,
  wristbandProduct,
}: {
  walletId: bigint;
  walletWristbandsList: {
    id: bigint;
    created_at: Date;
    return_status: string;
    wristband_code: string;
    is_deposit_wristband_returned: boolean | null;
  }[];
  walletWristbandsRentedList: {
    id: bigint;
    created_at: Date;
    return_status: string;
    wristband_code: string;
  }[];
  wristbandProduct: Product;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Daftar Gelang</h2>
      <Table>
        <TableHeader>
          <TableRow className="">
            <TableHead className="font-bold text-black">#</TableHead>
            <TableHead className="font-bold text-black">
              Tanggal & Waktu
            </TableHead>
            <TableHead className="font-bold text-black">Gelang</TableHead>
            <TableHead className="font-bold text-black">Deposit</TableHead>
            <TableHead className="font-bold text-black">Status</TableHead>
            <TableHead className="text-center font-bold text-black">
              Pengembalian Deposit
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {walletWristbandsList.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-lg italic text-black"
              >
                Tidak ada gelang yang dikembalikan
              </TableCell>
            </TableRow>
          ) : (
            walletWristbandsList.map((walletWristband, index) => (
              <TableRow
                key={walletWristband.id}
                className={cn(
                  walletWristband.return_status ===
                    WalletWristbandReturnStatusEnum.HAS_RETURNED
                    ? "bg-green-300 hover:bg-green-300"
                    : walletWristband.return_status ===
                        WalletWristbandReturnStatusEnum.NOT_RETURNED
                      ? "bg-red-300 hover:bg-red-300"
                      : "bg-white hover:bg-white",
                )}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {formaterDate(walletWristband.created_at, "dateTime")}
                </TableCell>
                <TableCell>
                  {"#" + walletWristband.id.toString(10).padStart(6, "0")}
                </TableCell>
                <TableCell>
                  {formatNumberToCurrency(
                    walletWristband.is_deposit_wristband_returned
                      ? 0
                      : Number(wristbandProduct.price),
                  )}
                </TableCell>
                <TableCell>
                  {getWalletWristbandReturnDisplayStatus(
                    walletWristband.return_status as WalletWristbandReturnStatusEnum,
                  )}
                </TableCell>
                <TableCell className="flex justify-center">
                  {walletWristband.is_deposit_wristband_returned ? (
                    <Check />
                  ) : (
                    <X />
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <GroupButtonRefundDepositAndSaldo
        walletId={walletId}
        walletWristbandsRentedList={walletWristbandsRentedList}
      />
    </div>
  );
}

function BreadcrumbPage() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href="/cashq-transaction">Transaksi Terbuka</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Refund</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
