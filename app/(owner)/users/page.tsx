import PaginationPage from "@/components/internal/PaginationPage";
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
import { FilterUser } from "./_components/filter-user";
import { TableListUsers } from "./_components/table-list-users";
import { getUsers } from "./_repositories/get-users";

export default async function UserIndexPage({
  searchParams,
}: {
  searchParams: Promise<
    BackOfficeSearchParams<{
      keyword: string;
      roleIds: string;
    }>
  >;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.USER_INDEX],
    user: user,
  });

  const userSearchParams = await searchParams;
  const { currentPage, currentPageSize, lastPage, offset, users } =
    await getUsers({ searchParams: userSearchParams });

  return (
    <SettingCard title="Kelola Pengguna" breadcrumb={<PageBreadcrumb />}>
      <FilterUser />

      <TableListUsers users={users} offset={offset} />

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
      <BreadcrumbList className="text-md text-blue-600">
        <BreadcrumbItem>Pelanggan</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
