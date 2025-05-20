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
import { TableListIpLocations } from "./_components/table-list-ip-locations";
import { getIpLocations } from "./_repositories/get-ip-locations";

export default async function IpLocationIndexPage({
  searchParams,
}: {
  searchParams: Promise<BackOfficeSearchParams>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_IP_LOCATION_INDEX],
    user: user,
  });

  const ipLocationSearchParams = await searchParams;
  const { currentPage, currentPageSize, lastPage, offset, ipLocations } =
    await getIpLocations({ searchParams: ipLocationSearchParams });

  return (
    <SettingCard title="Lokasi IP" breadcrumb={<PageBreadcrumb />}>
      <Button className="bg-qubu_blue" asChild>
        <Link href={"/back-office/ip-locations/create"}>
          + Tambah Lokasi IP Baru
        </Link>
      </Button>

      <TableListIpLocations ipLocations={ipLocations} offset={offset} />

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
        <BreadcrumbItem>Lokasi IP</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
