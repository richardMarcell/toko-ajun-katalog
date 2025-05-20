import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserPermissionNames } from "@/lib/services/permissions/get-user-permission-names";
import { ChartBar, LucideProps, Notebook, Utensils } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export default async function getReportMenuItems(): Promise<
  {
    name: string;
    href: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    show: boolean;
  }[]
> {
  const userPermissions = await getUserPermissionNames();

  return menuItems.map((item) => ({
    name: item.name,
    href: item.href,
    icon: item.icon,
    show: userPermissions.includes(item.permission),
  }));
}

const menuItems = [
  {
    name: "Dashboard & Statistik",
    href: "/report/dashboard-and-statistic",
    icon: ChartBar,
    permission: PermissionEnum.REPORT_DASHBOARD_AND_STATISTIC,
  },
  {
    name: "Laporan ParadisQ",
    href: "/report/paradisq-cashier-report",
    icon: Notebook,
    permission: PermissionEnum.REPORT_PARADISQ_CASHIER_REPORT,
  },
  {
    name: "Laporan Food Corner",
    href: "/report/food-corner",
    icon: Utensils,
    permission: PermissionEnum.REPORT_FOOD_CORNER,
  },
];
