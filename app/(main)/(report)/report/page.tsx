import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import getReportMenuItems from "@/repositories/get-report-menu-items";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ReportMenuPage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.REPORT],
    user: user,
  });

  const menuItems = await getReportMenuItems();

  return (
    <SettingCard title="Menu Laporan" breadcrumb={<PageBreadcrumb />}>
      <div className="flex flex-wrap gap-4">
        {menuItems.map((menu) => {
          if (!menu.show) return;
          return (
            <Link key={menu.name} href={menu.href} className="h-44 w-64">
              <Card className="h-full w-full hover:font-semibold hover:text-qubu_blue">
                <CardContent className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
                  <menu.icon />
                  <div>{menu.name}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </SettingCard>
  );
}

async function PageBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>Laporan</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
