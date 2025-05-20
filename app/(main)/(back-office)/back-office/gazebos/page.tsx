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
import { GazeboLegendCard } from "./_components/gazebo-legend-card";
import { GazeboList } from "./_components/gazebo-list";
import { TabSwitchGazeboType } from "./_components/tab-switch-gazebo-type";
import { getGazebos } from "./_repositories/get-gazebos";

export default async function GazeboIndexPage({
  searchParams,
}: {
  searchParams: Promise<BackOfficeSearchParams<{ type: string }>>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_GAZEBO_INDEX],
    user: user,
  });
  const gazeboSearchParams = await searchParams;

  const { gazebos, totalGazeboAvailable, type } = await getGazebos({
    searchParams: gazeboSearchParams,
  });

  return (
    <SettingCard title="Loker" breadcrumb={<PageBreadcrumb />}>
      <Button className="bg-qubu_blue" asChild>
        <Link href={"/back-office/gazebos/create"}>+ Tambah Gazebo Baru</Link>
      </Button>
      <TabSwitchGazeboType gazeboType={type} />

      <div className="space-y-4">
        <GazeboLegendCard totalGazebo={totalGazeboAvailable} type={type} />
        <GazeboList gazebos={gazebos} />
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
        <BreadcrumbItem>Gazebo</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
