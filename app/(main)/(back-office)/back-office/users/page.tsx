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
    permissionNames: [PermissionEnum.BACK_OFFICE_USER_INDEX],
    user: user,
  });

  const userSearchParams = await searchParams;
  const { currentPage, currentPageSize, lastPage, offset, users } =
    await getUsers({ searchParams: userSearchParams });

  return (
    <SettingCard
      title="Kelola Pengguna Aplikasi"
      breadcrumb={<PageBreadcrumb />}
    >
      <Button className="bg-qubu_blue" asChild>
        <Link href={"/back-office/users/create"}>+ Tambah Pengguna Baru</Link>
      </Button>

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
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href={`/back-office`}>Back Office</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Pengguna</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
