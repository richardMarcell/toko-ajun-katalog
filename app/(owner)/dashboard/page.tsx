import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { redirect } from "next/navigation";
import { getDashboardData } from "./_repositories/get-dashboard-data";
import { QuickStat } from "./_components/quick-stat";
import { DollarSignIcon, Star, User } from "lucide-react";
import { SubQuickStat } from "./_components/sub-quick-stat";
import {
  getSalesStatusCase,
  SalesStatusEnum,
} from "@/lib/enums/SalesStatusEnum";
import { getDailySales } from "./_repositories/get-daily-sales";
import DailySalesChart from "./_components/daily-sales-chart";

export default async function DashboardPage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.DASHBOARD],
    user: user,
  });

  const {
    totalSales,
    totalSalesClosed,
    averageRating,
    totalSalesOpen,
    totalSalesPreparing,
    totalSalesReady,
    totalUsers,
  } = await getDashboardData();

  const dailySales = await getDailySales();

  return (
    <SettingCard title="Dashboard" breadcrumb={<PageBreadcrumb />}>
      <div className="grid grid-cols-3 gap-4">
        <QuickStat
          icon={<User className="text-blue-600" />}
          description={`Total keseluruhan pengguna Toko Ajun`}
          title="Pengguna"
          totalData={totalUsers}
        />
        <QuickStat
          icon={<DollarSignIcon className="text-blue-600" />}
          description={`Total keseluruhan Penjualan yang terjadi di Toko Ajun`}
          title="Penjualan"
          totalData={totalSales}
        />
        <QuickStat
          icon={<Star className="text-blue-600" />}
          description={`Rating yang diberikan oleh pengguna Toko Ajun`}
          title="Rating"
          totalData={Number(averageRating.toFixed(2))}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <SubQuickStat
          title={getSalesStatusCase(SalesStatusEnum.OPEN)}
          totalData={totalSalesOpen}
        />
        <SubQuickStat
          title={getSalesStatusCase(SalesStatusEnum.PREPARING)}
          totalData={totalSalesPreparing}
        />
        <SubQuickStat
          title={getSalesStatusCase(SalesStatusEnum.READY)}
          totalData={totalSalesReady}
        />
        <SubQuickStat
          title={getSalesStatusCase(SalesStatusEnum.CLOSED)}
          totalData={totalSalesClosed}
        />
      </div>

      <div>
        <DailySalesChart data={dailySales} />
      </div>
    </SettingCard>
  );
}

function PageBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-blue-600">
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
