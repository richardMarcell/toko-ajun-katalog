import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserPermissionNames } from "@/lib/services/permissions/get-user-permission-names";
import {
  Badge,
  Box,
  BoxSelectIcon,
  DollarSign,
  LucideProps,
  User,
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

  return menuItems.map((item) => ({
    name: item.name,
    href: item.href,
    icon: item.icon,
    show: item.permissions.some((permission) =>
      userPermissions.includes(permission),
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
    name: "Kategori Produk",
    href: "/product-categories",
    icon: Badge,
    permissions: [PermissionEnum.PRODUCT_CATEGORY_INDEX],
  },
  {
    name: "Pengguna",
    href: "/users",
    icon: User,
    permissions: [PermissionEnum.USER_INDEX],
  },
  {
    name: "Penjualan",
    href: "/sales",
    icon: DollarSign,
    permissions: [PermissionEnum.USER_INDEX],
  },
  {
    name: "Produk",
    href: "/products",
    icon: Box,
    permissions: [PermissionEnum.PRODUCT_INDEX],
  },
];
