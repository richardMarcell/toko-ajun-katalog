import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { formatNumberToCurrency } from "@/lib/utils";
import { GlobeLock, Slash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FilterParadisQCashierReport } from "./_components/filter-paradisq-cashier-report";
import { getParadisQCashierReport } from "./_repositories/get-paradisq-cashier-report";
import { getUsers } from "./_repositories/get-users";

export default async function ReportParadisQCashierReport({
  searchParams,
}: {
  searchParams: Promise<{
    userId: string;
    startDate: string;
    endDate: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.REPORT_PARADISQ_CASHIER_REPORT],
    user: user,
  });

  const paradisQCashierReportSearchParams = await searchParams;

  const { users } = await getUsers();
  const paradisQCashierReport = await getParadisQCashierReport({
    searchParams: paradisQCashierReportSearchParams,
  });

  return (
    <SettingCard
      title="Laporan - Transaksi ParadisQ"
      breadcrumb={<PageBreadcrumb />}
    >
      <FilterParadisQCashierReport users={users} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2}>
              <div className="flex items-center justify-center gap-2 text-lg font-bold">
                <GlobeLock />
                Laporan Pendapatan Cash Kasir
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Total Transaksi Tiket Tunai</TableCell>
            <TableCell>
              {formatNumberToCurrency(paradisQCashierReport.totalTicketTunai)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Transaksi Deposit Tunai</TableCell>
            <TableCell>
              {formatNumberToCurrency(paradisQCashierReport.totalDepositTunai)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Transaksi Top Up Tunai</TableCell>
            <TableCell>
              {formatNumberToCurrency(paradisQCashierReport.totalTopUpTunai)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Transaksi Refund Tunai</TableCell>
            <TableCell>
              {formatNumberToCurrency(paradisQCashierReport.totalRefundTunai)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Transaksi Souvenir Tunai</TableCell>
            <TableCell>
              {formatNumberToCurrency(paradisQCashierReport.totalSouvenirTunai)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Transaksi Yearly Pass Tunai</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalYearlyPassTunai,
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Transaksi Kelas Renang Tunai</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalSwimmingClassTunai,
              )}
            </TableCell>
          </TableRow>
          <TableRow className="font-bold">
            <TableCell>Total Pendapatan Tunai</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalTunaiTransaction,
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="h-12"></TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Total Transaksi Tiket Non Tunai</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalTicketNonTunai,
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Transaksi Deposit Non Tunai</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalDepositNonTunai,
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Transaksi Top Up Non Tunai</TableCell>
            <TableCell>
              {formatNumberToCurrency(paradisQCashierReport.totalTopUpNonTunai)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Transaksi Souvenir Non Tunai</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalSouvenirNonTunai,
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Transaksi Yearly Pass Non Tunai</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalYearlyPassNonTunai,
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Transaksi Kelas Renang Non Tunai</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalSwimmingClassNonTunai,
              )}
            </TableCell>
          </TableRow>
          <TableRow className="font-bold">
            <TableCell>Total Pendapatan Non Tunai</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalNonTunaiTransaction,
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="h-12"></TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Jumlah Tiket Voucher</TableCell>
            <TableCell>
              {formatNumberToCurrency(paradisQCashierReport.totalTicketVoucher)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Transaksi Loker</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalLockerTransaction,
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Transaksi Gazebo</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalGazeboTransaction,
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Transaksi Baju Renang</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalSwimsuitRentTransaction,
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Transaksi Souvenir CashQ</TableCell>
            <TableCell>
              {formatNumberToCurrency(paradisQCashierReport.totalSouvenirCashQ)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="h-12"></TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Jumlah Pengunjung Void Tiket</TableCell>
            <TableCell>
              {paradisQCashierReport.totalCustomersTicketVoided}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Nominal Keseluruhan Void Tiket</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalTransactionTicketVoidedAmount,
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jumlah Void Souvenir</TableCell>
            <TableCell>{paradisQCashierReport.totalSouvenirVoided}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Harga Souvenir yang divoidkan</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalTransactionSouvenirVoidedAmount,
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jumlah Void Baju Renang</TableCell>
            <TableCell>
              {paradisQCashierReport.totalSwimsuitRentVoided}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Harga Baju Renang yang divoidkan</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalTransactionSwimsuitRentVoidedAmount,
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jumlah Loker yang telah di void</TableCell>
            <TableCell>{paradisQCashierReport.totalLockerVoided}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Harga Transaksi Loker yang divoidkan</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalTransactionLockerVoidedAmount,
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jumlah Transaksi Gazebo yang telah di void</TableCell>
            <TableCell>{paradisQCashierReport.totalGazeboVoided}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Harga Transaksi Gazebo yang divoidkan</TableCell>
            <TableCell>
              {formatNumberToCurrency(
                paradisQCashierReport.totalTransactionGazeboVoidedAmount,
              )}
            </TableCell>
          </TableRow>
        </TableBody>
        <TableCaption>Daftar Transaksi Satelite Qubu</TableCaption>
      </Table>
    </SettingCard>
  );
}

function PageBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href={`/report`}>Laporan</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Transaksi ParadisQ</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
