import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserPermissionNames } from "@/lib/services/permissions/get-user-permission-names";
import {
  ArchiveRestore,
  BadgeCheck,
  DoorOpen,
  FileClock,
  HandCoins,
  Home,
  LayoutDashboard,
  LocateIcon,
  LucideProps,
  Package,
  Percent,
  Spline,
  User,
  UserCheck,
  Utensils,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export default async function getBackOfficeMenuItems(): Promise<
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
    name: "Dashboard",
    href: "/back-office/dashboard",
    icon: LayoutDashboard,
    permission: PermissionEnum.BACK_OFFICE_DASHBOARD,
  },
  {
    name: "Pengelolaan Role",
    href: "/back-office/roles",
    icon: UserCheck,
    permission: PermissionEnum.BACK_OFFICE_ROLE_INDEX,
  },
  {
    name: "Pengelolaan Pengguna",
    href: "/back-office/users",
    icon: User,
    permission: PermissionEnum.BACK_OFFICE_USER_INDEX,
  },
  {
    name: "Pengelolaan Gelang",
    href: "/back-office/wristbands",
    icon: Spline,
    permission: PermissionEnum.BACK_OFFICE_WRISTBAND_INDEX,
  },
  {
    name: "Pengelolaan Produk",
    href: "/back-office/products",
    icon: Package,
    permission: PermissionEnum.BACK_OFFICE_PRODUCT_INDEX,
  },
  {
    name: "Pengelolaan Promo",
    href: "/back-office/promos",
    icon: Percent,
    permission: PermissionEnum.BACK_OFFICE_PROMO_INDEX,
  },
  {
    name: "Pengelolaan Locker",
    href: "/back-office/lockers",
    icon: ArchiveRestore,
    permission: PermissionEnum.BACK_OFFICE_LOCKER_INDEX,
  },
  {
    name: "Pengelolaan Gazebo",
    href: "/back-office/gazebos",
    icon: Home,
    permission: PermissionEnum.BACK_OFFICE_GAZEBO_INDEX,
  },
  {
    name: "Pengelolaan Lokasi IP",
    href: "/back-office/ip-locations",
    icon: LocateIcon,
    permission: PermissionEnum.BACK_OFFICE_IP_LOCATION_INDEX,
  },
  {
    name: "Pengelolaan Entry Pass",
    href: "/entry-pass",
    icon: BadgeCheck,
    permission: PermissionEnum.ENTRY_PASS_INDEX,
  },
  {
    name: "Gentrance",
    href: "/back-office/sales-waterpark-ticket",
    icon: DoorOpen,
    permission: PermissionEnum.BACK_OFFICE_GENTRANCE_INDEX,
  },
  {
    name: "Gfoodcorner",
    href: "/back-office/sales-food-corner",
    icon: Utensils,
    permission: PermissionEnum.BACK_OFFICE_GFOODCORNER_INDEX,
  },
  {
    name: "Log Aktivitas",
    href: "/back-office/activity-logs",
    icon: FileClock,
    permission: PermissionEnum.BACK_OFFICE_ACTIVITY_LOG_INDEX,
  },
  {
    name: "Pengelolaan Tenant",
    href: "/back-office/tenants",
    icon: HandCoins,
    permission: PermissionEnum.BACK_OFFICE_TENANT_INDEX,
  },
];
