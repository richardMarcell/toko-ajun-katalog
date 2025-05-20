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
import { TableListWristbands } from "./_components/table-list-wristbands";
import { getWristbands } from "./_repositories/get-wristbands";
import { FilterWristband } from "./_components/filter-wristband";

export default async function WristbandIndexPage({
  searchParams,
}: {
  searchParams: Promise<
    BackOfficeSearchParams<{
      keyword: string;
      status: string;
    }>
  >;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_WRISTBAND_INDEX],
    user: user,
  });

  const wristbandSearchParams = await searchParams;
  const { currentPage, currentPageSize, lastPage, offset, wristbands } =
    await getWristbands({ searchParams: wristbandSearchParams });

  return (
    <SettingCard title="Kelola Gelang" breadcrumb={<PageBreadcrumb />}>
      <Button className="bg-qubu_blue" asChild>
        <Link href={"/back-office/wristbands/create"}>
          + Tambah Gelang Baru
        </Link>
      </Button>

      <FilterWristband />

      <TableListWristbands wristbands={wristbands} offset={offset} />

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
        <BreadcrumbItem>Gelang</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
