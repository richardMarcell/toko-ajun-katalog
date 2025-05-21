import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import Link from "next/link";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { redirect } from "next/navigation";
import { can } from "@/lib/services/permissions/can";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import FormCreateCategoryProduct from "../_components/form-create-category-product";

export default async function ProductCategoryCreatePage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.PRODUCT_CATEGORY_CREATE],
    user: user,
  });

  return (
    <SettingCard
      title="Tambah Kategori Produk Baru"
      breadcrumb={<PageBreadcrumb />}
    >
      <FormCreateCategoryProduct />
    </SettingCard>
  );
}

async function PageBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-blue-600">
        <BreadcrumbItem>
          <Link href={`/product-categories`}>Kategori Produk</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Tambah Kategori Produk</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
