import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
import {
  getWalletWristbandReturnDisplayStatus,
  WalletWristbandReturnStatusEnum,
} from "@/lib/enums/WalletWristbandReturnStatusEnum";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { cn, formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";
import { Product } from "@/types/product";
import { and, eq, inArray, or } from "drizzle-orm";
import { AlertTriangle, Check, Slash, X } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import GroupButtonRefundDepositAndSaldo from "./_components/GroupButtonRefundDepositAndSaldo";

export default async function RefundCashQIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ walletId: string }>;
  searchParams: Promise<{ wristbandCodes: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [
      PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_SHOW_RENTED_WRISTBAND_LIST,
    ],
    user: user,
  });

  const { walletId } = await params;
  const { wristbandCodes } = await searchParams;

  const splitedWristbandCodes = wristbandCodes?.split(",") ?? [];

  const wallet = await db.query.wallets.findFirst({
    columns: {
      id: true,
      saldo: true,
    },
    where: eq(wallets.id, BigInt(walletId)),
  });

  if (!wallet) {
    console.error("Wallet is not found");
    return notFound();
  }

  const walletWristbandValidList = await db.query.walletWristband.findMany({
    where: and(
      eq(walletWristband.wallet_id, wallet.id),
      eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
      or(
        eq(
          walletWristband.return_status,
          WalletWristbandReturnStatusEnum.HAS_RETURNED,
        ),
        eq(
          walletWristband.return_status,
          WalletWristbandReturnStatusEnum.NOT_RETURNED,
        ),
      ),
    ),
  });

  const validWristbandCode = walletWristbandValidList.map(
    ({ wristband_code }) => wristband_code,
  );

  const isRequestedWristbandCodeValid = splitedWristbandCodes.every(
    (val, index) => val === validWristbandCode[index],
  );

  if (!isRequestedWristbandCodeValid)
    return (
      <ForbiddenComponent
        message="Terdapat kesalahan pada input kode gelang. Silakan periksa kembali kode gelang yang Anda masukkan"
        redirectUrl={`/cashq-transaction/${walletId}/refund-cashq`}
      />
    );

  const walletWristbandsList = await db.query.walletWristband.findMany({
    columns: {
      id: true,
      created_at: true,
      return_status: true,
      wristband_code: true,
      is_deposit_wristband_returned: true,
    },
    where: and(
      eq(walletWristband.wallet_id, BigInt(walletId)),
      inArray(walletWristband.wristband_code, splitedWristbandCodes),
    ),
  });

  const { wristbandProduct } = await getWristbandProduct();

  if (!wristbandProduct) {
    console.error("Product wristband is not found");
    return notFound();
  }

  const wristbandNotReturnedOpenCount = (
    await db.query.walletWristband.findMany({
      where: and(
        eq(walletWristband.wallet_id, wallet.id),
        eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
        eq(
          walletWristband.return_status,
          WalletWristbandReturnStatusEnum.NOT_RETURNED,
        ),
      ),
    })
  ).length;

  const wristbandNotReturnedCloseCount = (
    await db.query.walletWristband.findMany({
      where: and(
        eq(walletWristband.wallet_id, wallet.id),
        eq(walletWristband.status, WalletWristbandStatusEnum.CLOSED),
        eq(
          walletWristband.return_status,
          WalletWristbandReturnStatusEnum.NOT_RETURNED,
        ),
      ),
    })
  ).length;

  const wristbandDepositNotReturnedCount = (
    await db.query.walletWristband.findMany({
      where: and(
        eq(walletWristband.wallet_id, wallet.id),
        eq(walletWristband.is_deposit_wristband_returned, false),
      ),
    })
  ).length;

  const isHaveWristbandNotReturnedOpen = wristbandNotReturnedOpenCount > 0;
  const isHaveWristbandNotReturnedClose = wristbandNotReturnedCloseCount > 0;
  const isHaveWristbandDepositNotReturned =
    wristbandDepositNotReturnedCount > 0;
  const isWalletSaldoReturned = Number(wallet.saldo) === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="text-2xl">Refund CashQ - Return Wristband</h1>
        </CardTitle>
        <BreadcrumbPage walletId={walletId} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 pt-8">
          <TableWallet
            walletWristbandsList={walletWristbandsList}
            wristbandProduct={wristbandProduct}
            walletSaldo={Number(wallet.saldo)}
          />
          <GroupButtonRefundDepositAndSaldo
            walletId={wallet.id}
            wristbandCodes={splitedWristbandCodes}
            isHaveWristbandNotReturnedOpen={isHaveWristbandNotReturnedOpen}
            isHaveWristbandNotReturnedClose={isHaveWristbandNotReturnedClose}
            isHaveWristbandDepositNotReturned={
              isHaveWristbandDepositNotReturned
            }
            isWalletSaldoReturned={isWalletSaldoReturned}
          />
        </div>
      </CardContent>
    </Card>
  );
}

async function TableWallet({
  walletWristbandsList,
  wristbandProduct,
  walletSaldo,
}: {
  walletWristbandsList: {
    id: bigint;
    created_at: Date;
    return_status: string;
    wristband_code: string;
    is_deposit_wristband_returned: boolean | null;
  }[];
  wristbandProduct: Product;
  walletSaldo: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="">
          <TableHead className="font-bold text-black">#</TableHead>
          <TableHead className="font-bold text-black">
            Tanggal & Waktu
          </TableHead>
          <TableHead className="font-bold text-black">Kode Gelang</TableHead>
          <TableHead className="font-bold text-black">Sisa Saldo</TableHead>
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
                  ? "bg-green-300"
                  : walletWristband.return_status ===
                      WalletWristbandReturnStatusEnum.NOT_RETURNED
                    ? "bg-red-300"
                    : "bg-white",
              )}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {formaterDate(walletWristband.created_at, "dateTime")}
              </TableCell>
              <TableCell>{walletWristband.wristband_code}</TableCell>
              <TableCell>{formatNumberToCurrency(walletSaldo)}</TableCell>
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
  );
}

function BreadcrumbPage({ walletId }: { walletId: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href="/cashq-transaction">Transaksi Terbuka</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <Link href={`/cashq-transaction/${walletId}/refund-cashq`}>
            Refund
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Return Gelang</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function ForbiddenComponent({
  message,
  redirectUrl,
}: {
  message: string;
  redirectUrl: string;
}) {
  return (
    <div className="p-8 text-center">
      <AlertTriangle size={48} className="mx-auto mb-4 text-qubu_red" />
      <h2 className="mb-2 text-2xl font-bold">Akses Ditolak</h2>
      <p className="mb-4 text-gray-600">{message}</p>
      <Button className="bg-qubu_blue" asChild>
        <Link href={redirectUrl}>Kembali</Link>
      </Button>
    </div>
  );
}
