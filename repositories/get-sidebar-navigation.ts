import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getIpLocationPermissionNames } from "@/lib/services/permissions/get-ip-location-permission-names";
import { getUserPermissionNames } from "@/lib/services/permissions/get-user-permission-names";
import {
  BadgeCheck,
  ChartNoAxesCombined,
  CheckCheck,
  CircleArrowOutUpRight,
  Database,
  FilePenLine,
  Gift,
  HandPlatter,
  History,
  LayoutList,
  LucideProps,
  ScrollText,
  SendToBack,
  Shirt,
  ShoppingBag,
  Soup,
  Ticket,
  Waves,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export default async function getSidebarNavigation(): Promise<
  {
    name: string;
    href: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    show: boolean;
  }[]
> {
  // Mendapatkan permissions dari database untuk user yang sedang login
  const userPermissions = await getUserPermissionNames();
  const ipLocationPermissions = await getIpLocationPermissionNames();

  return menuItems.map((item) => ({
    name: item.name,
    href: item.href,
    icon: item.icon,
    show: item.permissions.some(
      (permission) =>
        userPermissions.includes(permission) &&
        ipLocationPermissions.includes(permission),
    ),
  }));
}

const menuItems: {
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  permissions: string[];
}[] = [
  {
    name: "Back Office",
    href: "/back-office",
    icon: Database,
    permissions: [PermissionEnum.BACK_OFFICE],
  },
  {
    name: "Report",
    href: "/report",
    icon: ChartNoAxesCombined,
    permissions: [PermissionEnum.REPORT],
  },
  {
    name: "Order List Food Corner",
    href: "/pos/food-corner/sales",
    icon: LayoutList,
    permissions: [PermissionEnum.FOOD_CORNER_SALES_INDEX],
  },
  {
    name: "Order Food Corner",
    href: "/pos/food-corner/order",
    icon: Soup,
    permissions: [PermissionEnum.FOOD_CORNER_SALES_CREATE],
  },
  {
    name: "Dimsum",
    href: "/pos/dimsum/tables",
    icon: HandPlatter,
    permissions: [PermissionEnum.DIMSUM_CAPTAIN_ORDER_CREATE],
  },
  {
    name: "Order Souvenir",
    href: "/pos/souvenir/order",
    icon: Gift,
    permissions: [PermissionEnum.SOUVENIR_SALES_CREATE],
  },
  {
    name: "Order Locker",
    href: "/pos/locker/order",
    icon: ShoppingBag,
    permissions: [PermissionEnum.LOCKER_SALES_CREATE],
  },
  {
    name: "Wristband Rent",
    href: "/wristband-rent/create",
    icon: CircleArrowOutUpRight,
    permissions: [PermissionEnum.WRISTBAND_RENT_WALLET_CREATE],
  },
  {
    name: "Checker Food Corner",
    href: "/pos/food-corner/checker",
    icon: CheckCheck,
    permissions: [
      PermissionEnum.FOOD_CORNER_SALES_CHECKER,
      PermissionEnum.FOOD_CORNER_SALES_CHECKER_SHOW_ALL,
    ],
  },
  {
    name: "Checker History Food Corner",
    href: "/pos/food-corner/checker-history",
    icon: History,
    permissions: [
      PermissionEnum.FOOD_CORNER_SALES_CHECKER_HISTORY,
      PermissionEnum.FOOD_CORNER_SALES_CHECKER_HISTORY_SHOW_ALL,
    ],
  },
  {
    name: "Swimming Class",
    href: "/swimming-class",
    icon: Waves,
    permissions: [PermissionEnum.SWIMMING_CLASS_INDEX],
  },
  {
    name: "Entry Pass",
    href: "/entry-pass",
    icon: BadgeCheck,
    permissions: [PermissionEnum.ENTRY_PASS_INDEX],
  },
  {
    name: "Swimsuit Rent",
    href: "/swimsuit-rent/create",
    icon: Shirt,
    permissions: [PermissionEnum.SWIMSUIT_RENT_SALES_CREATE],
  },
  {
    name: "Swimsuit Rent Return",
    href: "/swimsuit-rent/return",
    icon: SendToBack,
    permissions: [PermissionEnum.SWIMSUIT_RENT_RETURN_INDEX],
  },
  {
    name: "CashQ Transaction",
    href: "/cashq-transaction",
    icon: FilePenLine,
    permissions: [PermissionEnum.CASHQ_TRANSACTION_INDEX],
  },
  {
    name: "Ticket",
    href: "/tickets/order",
    icon: Ticket,
    permissions: [PermissionEnum.TICKET_SALES_CREATE],
  },
  {
    name: "Ticket Booklet Promo",
    href: "/tickets-booklet-promo",
    icon: Ticket,
    permissions: [PermissionEnum.TICKET_SALES_CREATE],
  },
  {
    name: "Ticket Online",
    href: "/tickets-online/sales/create",
    icon: Ticket,
    permissions: [PermissionEnum.TICKET_SALES_CREATE],
  },
  {
    name: "Resto Patio",
    href: "/pos/resto/patio/tables",
    icon: HandPlatter,
    permissions: [PermissionEnum.RESTO_PATIO_SALES_CREATE],
  },
  {
    name: "Sales List",
    href: "/sales",
    icon: ScrollText,
    permissions: [PermissionEnum.SALES_INDEX, PermissionEnum.SALES_INDEX_ALL],
  },
];
