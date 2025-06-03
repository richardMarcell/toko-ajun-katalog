import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { redirect } from "next/navigation";
import { FilterSales } from "./_components/filter-sales";
import { TableListSales } from "./_components/table-list-sales";
import { getSalesReport } from "./_repositories/get-sales-report";

export default async function SalesIndexPage({
  searchParams,
}: {
  searchParams: Promise<
    BackOfficeSearchParams<{
      status: string;
      startDate: string;
      endDate: string;
    }>
  >;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SALES_INDEX],
    user: user,
  });

  const salesSearchParams = await searchParams;

  const salesReport = await getSalesReport({
    searchParams: salesSearchParams,
  });

  return (
    <SettingCard title="Kelola Penjualan" breadcrumb={<PageBreadcrumb />}>
      <FilterSales />

      <TableListSales sales={salesReport} />
    </SettingCard>
  );
}

function PageBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-blue-600">
        <BreadcrumbItem>Penjualan</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
