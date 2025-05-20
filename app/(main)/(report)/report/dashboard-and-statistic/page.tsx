import PaginationPage from "@/components/internal/PaginationPage";
import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { formatNumberToCurrency } from "@/lib/utils";
import { ChartPie, ShoppingCart, Slash, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FilterUser } from "./_components/filter-user";
import { QuickStat } from "./_components/quick-stat";
import { TableListUsers } from "./_components/table-list-users";
import { getQuickStatsData } from "./_repositories/get-quick-stats-data";
import { getUsers } from "./_repositories/get-users";

export default async function ReportDashboardAndStatisticPage({
  searchParams,
}: {
  searchParams: Promise<{
    pageSize: string;
    page: string;
    keyword: string;
    roleIds: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.REPORT_DASHBOARD_AND_STATISTIC],
    user: user,
  });

  const { totalRefundAmount, totalCustomers, totalCashQ } =
    await getQuickStatsData();

  const userSearchParams = await searchParams;
  const { currentPage, currentPageSize, lastPage, offset, users } =
    await getUsers({ searchParams: userSearchParams });

  return (
    <SettingCard
      title="Laporan - Dashboard & Statistik"
      breadcrumb={<PageBreadcrumb />}
    >
      <div className="grid grid-cols-3 gap-4">
        <QuickStat
          icon={<ChartPie className="h-12 w-12 text-qubu_blue" />}
          title="Nominal Refund"
          totalData={formatNumberToCurrency(totalRefundAmount)}
        />
        <QuickStat
          icon={<User className="h-12 w-12 text-qubu_blue" />}
          title="Pengunjung Hari Ini"
          totalData={totalCustomers}
        />
        <QuickStat
          icon={<ShoppingCart className="h-12 w-12 text-qubu_blue" />}
          title="Total CashQ"
          totalData={totalCashQ}
        />
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Karyawan</h2>
        <div>
          <FilterUser />

          <TableListUsers users={users} offset={offset} />

          <PaginationPage
            currentPage={currentPage}
            currentPageSize={currentPageSize}
            lastPage={lastPage}
          />
        </div>
      </div>
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
        <BreadcrumbItem>Dashboard & Statistik</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
