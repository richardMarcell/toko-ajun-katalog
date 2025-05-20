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
import TableListActivityLog from "./_components/table-list-activity-log";
import getActivityLogs from "./_repositories/get-activity-logs";

export default async function ActivityLogIndexPage({
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
    permissionNames: [PermissionEnum.BACK_OFFICE_ACTIVITY_LOG_INDEX],
    user: user,
  });

  const userSearchParams = await searchParams;
  const { currentPage, currentPageSize, lastPage, offset, activityLogs } =
    await getActivityLogs({ searchParams: userSearchParams });

  return (
    <SettingCard title="Waterpark" breadcrumb={<PageBreadcrumb />}>
      <TableListActivityLog activityLogs={activityLogs} offset={offset} />

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
        <BreadcrumbItem>Log Aktivitas</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
