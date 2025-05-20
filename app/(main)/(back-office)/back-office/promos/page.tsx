import PaginationPage from "@/components/internal/PaginationPage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { Slash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import SettingCard from "../../../../../components/internal/SettingCard";
import { getPromos } from "./_repositories/get-promos";
import { FilterPromo } from "./_components/filter-promo";
import { TableListPromos } from "./_components/table-list-promos";

export default async function PromoIndexPage({
  searchParams,
}: {
  searchParams: Promise<
    BackOfficeSearchParams<{
      keyword: string;
      types: string;
    }>
  >;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_PROMO_INDEX],
    user: user,
  });

  const promoSearchParams = await searchParams;
  const { currentPage, currentPageSize, lastPage, offset, promos } =
    await getPromos({ searchParams: promoSearchParams });

  return (
    <SettingCard title="Kelola Promo" breadcrumb={<PageBreadcrumb />}>
      <Button className="bg-qubu_blue" asChild>
        <Link href={"/back-office/promos/create"}>+ Tambah Promo Baru</Link>
      </Button>

      <FilterPromo />

      <TableListPromos promos={promos} offset={offset} />

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
        <BreadcrumbItem>Promo</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
