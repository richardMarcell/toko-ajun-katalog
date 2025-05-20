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
import { getLockers } from "../lockers/_repositories/get-lockers";
import { LockerLegendCard } from "./_components/locker-legend-card";
import { LockerList } from "./_components/locker-list";
import { TabSwitchLockerType } from "./_components/tab-switch-locker-type";

export default async function LockerIndexPage({
  searchParams,
}: {
  searchParams: Promise<BackOfficeSearchParams<{ type: string }>>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_LOCKER_INDEX],
    user: user,
  });
  const lockerSearchParams = await searchParams;

  const { lockers, totalLockerAvailable, type } = await getLockers({
    searchParams: lockerSearchParams,
  });

  return (
    <SettingCard title="Loker" breadcrumb={<PageBreadcrumb />}>
      <Button className="bg-qubu_blue" asChild>
        <Link href={"/back-office/lockers/create"}>+ Tambah Loker Baru</Link>
      </Button>
      <TabSwitchLockerType lockerType={type} />

      <div className="space-y-4">
        <LockerLegendCard totalLocker={totalLockerAvailable} type={type} />
        <LockerList lockers={lockers} />
      </div>
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
        <BreadcrumbItem>Loker</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
