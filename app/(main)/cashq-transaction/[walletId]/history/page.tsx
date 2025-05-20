import { CashqTransactionGeneralInformation } from "@/components/internal/domains/cashq-transaction/history/cashq-transaction-general-information";
import { CashQTransactionHistoryHeader } from "@/components/internal/domains/cashq-transaction/history/cashq-transaction-history-header";
import { CashqTransactionTicketInformation } from "@/components/internal/domains/cashq-transaction/history/cashq-transaction-ticket-information";
import { TableListCashqTransactionGazeboRentHistory } from "@/components/internal/domains/cashq-transaction/history/table-list-cashq-transaction-gazebo-rent-history";
import { TableListCashqTransactionLockerRentHistory } from "@/components/internal/domains/cashq-transaction/history/table-list-cashq-transaction-locker-rent-history";
import { TableListCashqTransactionSwimsuitRentHistory } from "@/components/internal/domains/cashq-transaction/history/table-list-cashq-transaction-swimsuit-rent-history";
import { TableListCashqTransactionTopUpHistory } from "@/components/internal/domains/cashq-transaction/history/table-list-cashq-transaction-top-up-history";
import { TableListWristbands } from "@/components/internal/domains/cashq-transaction/history/table-list-wristbands";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getCashQTransactionTicketList } from "@/repositories/domain/cashq-transaction/history/get-cashq-transaction-ticket-list";
import { getCashQTransactionWithTypeGazeboRentList } from "@/repositories/domain/cashq-transaction/history/get-cashq-transaction-with-type-gazebo-rent-list ";
import { getCashQTransactionWithTypeLockerRentList } from "@/repositories/domain/cashq-transaction/history/get-cashq-transaction-with-type-locker-rent-list";
import { getCashQTransactionWithTypeSwimsuitRentList } from "@/repositories/domain/cashq-transaction/history/get-cashq-transaction-with-type-swimsuit-rent-list";
import { getCashQTransactionWithTypeTopUpList } from "@/repositories/domain/cashq-transaction/history/get-cashq-transaction-with-type-top-up-list";
import { getCashQTransactionWristbandList } from "@/repositories/domain/cashq-transaction/history/get-cashq-transaction-wristband-list";
import { getWalletGeneralInformation } from "@/repositories/domain/cashq-transaction/history/get-wallet-general-information";
import { ArrowLeft, Slash } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function CashqHistoryPage({
  params,
}: {
  params: Promise<{
    walletId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_HISTORY_SHOW],
    user: user,
  });

  const { walletId } = await params;

  const { walletGeneralInformation } = await getWalletGeneralInformation({
    walletId,
  });
  if (!walletGeneralInformation) return notFound();

  const { cashqTransactionTicketList } = await getCashQTransactionTicketList({
    walletId,
  });

  const { cashqTransactionWristbandList } =
    await getCashQTransactionWristbandList({ walletId });
  const { cashqTransactionWithTypeTopUpList } =
    await getCashQTransactionWithTypeTopUpList({ walletId });
  const { cashqTransactionWithTypeSwimsuitRentList } =
    await getCashQTransactionWithTypeSwimsuitRentList({ walletId });
  const { cashqTransactionWithTypeLockerRentList } =
    await getCashQTransactionWithTypeLockerRentList({ walletId });
  const { cashqTransactionWithTypeGazeboRentList } =
    await getCashQTransactionWithTypeGazeboRentList({ walletId });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">History</CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant={"outline"} asChild>
          <Link
            className="flex items-center justify-center gap-2"
            href={"/cashq-transaction"}
          >
            <ArrowLeft />
            <span>Kembali</span>
          </Link>
        </Button>

        <div className="space-y-6">
          <CashQTransactionHistoryHeader />
          <CashqTransactionGeneralInformation
            walletGeneralInformation={walletGeneralInformation}
          />

          {cashqTransactionTicketList && (
            <CashqTransactionTicketInformation
              cashqTransactionTicketList={
                cashqTransactionTicketList.ticketSale.salesDetails
              }
            />
          )}

          <TableListWristbands
            cashqTransactionWristbandList={cashqTransactionWristbandList}
            totalDepositAmount={Number(walletGeneralInformation.deposit_amount)}
          />
        </div>

        <div className="pt-8">
          <h2 className="text-xl font-bold">Daftar Transaksi CashQ</h2>
          <div className="space-y-8">
            <TableListCashqTransactionTopUpHistory
              cashqTransactionWithTypeTopUpList={
                cashqTransactionWithTypeTopUpList
              }
            />

            <TableListCashqTransactionSwimsuitRentHistory
              cashqTransactionWithTypeSwimsuitRentList={
                cashqTransactionWithTypeSwimsuitRentList
              }
            />

            <TableListCashqTransactionLockerRentHistory
              cashqTransactionWithTypeLockerRentList={
                cashqTransactionWithTypeLockerRentList
              }
            />

            <TableListCashqTransactionGazeboRentHistory
              cashqTransactionWithTypeGazeboRentList={
                cashqTransactionWithTypeGazeboRentList
              }
            />

            {/* TODO: show all transaction pay with CashQ */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BreadcrumbPage() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href={"/cashq-transaction"}>Transaksi Terbuka</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <div>History</div>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
