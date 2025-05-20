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
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { Slash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FilterSaleFoodCorner } from "./_components/filter-sale-food-corner";
import TableListSalesFoodCorner from "./_components/table-list-sales-food-corner";
import { getSalesFoodCorner } from "./_repositories/get-sales-food-corner";

export default async function SalesFoodCornerIndexPage({
  searchParams,
}: {
  searchParams: Promise<
    BackOfficeSearchParams<{
      keyword: string;
      date: string;
    }>
  >;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_GFOODCORNER_INDEX],
    user: user,
  });

  const salesFoodCornerSearchParams = await searchParams;
  const { currentPage, currentPageSize, lastPage, offset, sales } =
    await getSalesFoodCorner({ searchParams: salesFoodCornerSearchParams });

  return (
    <SettingCard title="Food Corner" breadcrumb={<PageBreadcrumb />}>
      <FilterSaleFoodCorner />

      <TableListSalesFoodCorner sales={sales} offset={offset} />

      <PaginationPage
        currentPage={currentPage}
        currentPageSize={currentPageSize}
        lastPage={lastPage}
      />
    </SettingCard>
  );
}

function PageBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href={`/back-office`}>Back Office</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Gfoodcorner</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
