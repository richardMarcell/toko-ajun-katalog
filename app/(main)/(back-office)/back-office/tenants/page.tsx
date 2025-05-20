import PaginationPage from "@/components/internal/PaginationPage";
import SettingCard from "@/components/internal/SettingCard";
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
import { FilterTenant } from "./_components/filter-tenant";
import { TableListTenants } from "./_components/table-list-tenants";
import { getTenantsLists } from "./_repositories/get-tenants-list";

export default async function TenantIndexPage({
  searchParams,
}: {
  searchParams: Promise<BackOfficeSearchParams<{ keyword: string }>>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_TENANT_INDEX],
    user: user,
  });
  const tenantSearchParams = await searchParams;

  const { currentPage, currentPageSize, lastPage, offset, tenantsList } =
    await getTenantsLists({ searchParams: tenantSearchParams });

  return (
    <SettingCard title="Tenant" breadcrumb={<PageBreadcrumb />}>
      <Button className="bg-qubu_blue" asChild>
        <Link href={"/back-office/tenants/create"}>+ Tambah Tenant Baru</Link>
      </Button>

      <FilterTenant />

      <TableListTenants tenantsList={tenantsList} offset={offset} />

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
        <BreadcrumbItem>Tenant</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
