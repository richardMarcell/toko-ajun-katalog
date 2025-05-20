import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { redirect } from "next/navigation";

export default async function ProductCategoriesIndexPage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.PRODUCT_CATEGORY_INDEX],
    user: user,
  });

  return (
    <SettingCard title="Kategori Produk" breadcrumb={<PageBreadcrumb />}>
      <div></div>
    </SettingCard>
  );
}

function PageBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>Kategori Produk</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
