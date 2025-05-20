import FilterCashqCode from "@/components/internal/domains/cashq-transaction/list/filter-cashq-code";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
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
  getWalletStatusCase,
  WalletStatusEnum,
} from "@/lib/enums/WalletStatusEnum";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { User } from "@/types/next-auth";
import { and, eq, sql } from "drizzle-orm";
import {
  BadgeDollarSign,
  Ban,
  Clock,
  House,
  Lock,
  SquarePlus,
  Undo2,
  WavesLadder,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Fragment } from "react";

type WalletType = {
  id: bigint;
  code: string | null;
  customer_name: string;
  customer_phone_number: string;
  saldo: string;
  status: string;
  created_at: Date;
  walletWristbands: WalletWristbandType[];
};

type WalletWristbandType = {
  wristband_code: string;
};

export default async function CashqTransactionIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ wristbandCode: string; isShowAll: boolean }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_INDEX],
    user: user,
  });

  const { wristbandCode, isShowAll } = await searchParams;
  // const currentDate = format(getCurrentDate(), "yyyy-MM-dd");

  // TODO: fix when filter by CashQ code on table Kode Gelang showed just filterd CashQ Code
  const walletList =
    isShowAll || wristbandCode
      ? await db
          .select({
            id: wallets.id,
            code: wallets.code,
            customer_name: wallets.customer_name,
            customer_phone_number: wallets.customer_phone_number,
            saldo: wallets.saldo,
            status: wallets.status,
            created_at: wallets.created_at,
            walletWristbands: sql`JSON_ARRAYAGG(
            JSON_OBJECT(
              'wristband_code', ${walletWristband.wristband_code}
            )
          )`.as("walletWristbands"),
          })
          .from(wallets)
          .where(
            and(
              eq(wallets.status, WalletStatusEnum.OPEN),
              // eq(sql`DATE(${wallets.created_at})`, currentDate),
              wristbandCode
                ? eq(walletWristband.wristband_code, wristbandCode)
                : undefined,
            ),
          )
          .leftJoin(
            walletWristband,
            and(
              eq(walletWristband.wallet_id, wallets.id),
              eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
            ),
          )
          .groupBy(wallets.id)
      : [];

  const walletListMapped: WalletType[] = walletList.map((wallet) => ({
    ...wallet,
    walletWristbands: wallet.walletWristbands
      ? (wallet.walletWristbands as WalletWristbandType[])
      : [],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Transaksi Hari Ini</CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent className="space-y-4">
        <FilterCashqCode />

        <div className="pt-8">
          {(isShowAll || wristbandCode) && (
            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead className="font-bold text-black">#</TableHead>
                  <TableHead className="font-bold text-black">
                    Kode CashQ
                  </TableHead>
                  <TableHead className="font-bold text-black">
                    Tanggal & Waktu
                  </TableHead>
                  <TableHead className="font-bold text-black">
                    Kode Gelang
                  </TableHead>
                  <TableHead className="font-bold text-black">Nama</TableHead>
                  <TableHead className="font-bold text-black">No. Hp</TableHead>
                  <TableHead className="font-bold text-black">
                    Sisa Saldo
                  </TableHead>
                  <TableHead className="font-bold text-black">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {walletList.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-lg italic text-black"
                    >
                      Belum Ada Transaksi Hari Ini
                    </TableCell>
                  </TableRow>
                )}
                {walletListMapped.map((wallet, index) => {
                  return (
                    <Fragment key={wallet.id}>
                      <TableRow>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{wallet.code}</TableCell>
                        <TableCell>
                          {formaterDate(wallet.created_at, "dateTime")}
                        </TableCell>
                        <TableCell>
                          {wallet.walletWristbands
                            .map(
                              (walletWristband) =>
                                walletWristband.wristband_code,
                            )
                            .join(", ")}
                        </TableCell>
                        <TableCell>{wallet.customer_name}</TableCell>
                        <TableCell>{wallet.customer_phone_number}</TableCell>
                        <TableCell>
                          {formatNumberToCurrency(Number(wallet.saldo))}
                        </TableCell>
                        <TableCell>
                          {getWalletStatusCase(
                            wallet.status as WalletStatusEnum,
                          )}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell colSpan={8} className="space-x-2">
                          <GroupButton
                            walletId={wallet.id}
                            firstWristbandCode={
                              wallet.walletWristbands[0].wristband_code
                            }
                            user={user}
                          />
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

async function GroupButton({
  walletId,
  firstWristbandCode,
  user,
}: {
  walletId: bigint;
  firstWristbandCode: string;
  user: User;
}) {
  const isUserCanBindingCashQ = await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_BINDING_CASHQ_INDEX],
    user: user,
    isRedirectToForbiddenPage: false,
  });

  const isUserCanLockerRent = await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_INDEX],
    user: user,
    isRedirectToForbiddenPage: false,
  });

  const isUserCanGazeboRent = await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_GAZEBO_RENT_INDEX],
    user: user,
    isRedirectToForbiddenPage: false,
  });

  const isUserCanSwimsuitRent = await can({
    permissionNames: [PermissionEnum.SWIMSUIT_RENT_SALES_CREATE],
    user: user,
    isRedirectToForbiddenPage: false,
  });

  const isUserCanTopUpCashQ = await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_TOP_UP_CREATE],
    user: user,
    isRedirectToForbiddenPage: false,
  });

  const isUserCanRefund = await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_SHOW],
    user: user,
    isRedirectToForbiddenPage: false,
  });

  const isUserCanVoid = await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_VOID],
    user: user,
    isRedirectToForbiddenPage: false,
  });

  const isUserCanAccessHistory = await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_HISTORY_SHOW],
    user: user,
    isRedirectToForbiddenPage: false,
  });

  return (
    <Fragment>
      {isUserCanBindingCashQ && (
        <Button asChild className="bg-qubu_green font-semibold">
          <Link href={`/cashq-transaction/${walletId}/binding-cashq`}>
            <SquarePlus />
            Binding CashQ
          </Link>
        </Button>
      )}
      {isUserCanLockerRent && (
        <Button asChild className="bg-qubu_purple font-semibold">
          <Link href={`/cashq-transaction/${walletId}/locker-rent`}>
            <Lock />
            Locker
          </Link>
        </Button>
      )}
      {isUserCanGazeboRent && (
        <Button asChild>
          <Link href={`/cashq-transaction/${walletId}/gazebo-rent`}>
            <House />
            Gazebo
          </Link>
        </Button>
      )}
      {isUserCanSwimsuitRent && (
        <Button asChild className="bg-qubu_turquoise_blue font-semibold">
          <Link
            href={`/swimsuit-rent/create?wristbandCode=${firstWristbandCode}`}
          >
            <WavesLadder />
            Baju Renang
          </Link>
        </Button>
      )}
      {isUserCanTopUpCashQ && (
        <Button asChild className="bg-qubu_orange font-semibold">
          <Link href={`/cashq-transaction/${walletId}/top-up`}>
            <BadgeDollarSign />
            Top-Up
          </Link>
        </Button>
      )}
      {isUserCanRefund && (
        <Button asChild className="bg-qubu_green font-semibold">
          <Link href={`/cashq-transaction/${walletId}/refund-cashq`}>
            <Undo2 />
            Refund
          </Link>
        </Button>
      )}
      {isUserCanVoid && (
        <Button asChild className="bg-qubu_red font-semibold">
          <Link href={`/sales`}>
            <Ban />
            Void
          </Link>
        </Button>
      )}
      {isUserCanAccessHistory && (
        <Button asChild className="bg-qubu_vivid_blue font-semibold">
          <Link href={`/cashq-transaction/${walletId}/history`}>
            <Clock />
            History
          </Link>
        </Button>
      )}
    </Fragment>
  );
}

function BreadcrumbPage() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href="/cashq-transaction?isShowAll=true" className="underline">
            See all transaction
          </Link>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
