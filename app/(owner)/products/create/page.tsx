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
import { Slash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import FormCreateProduct from "../_components/form-create-product";
import { getProductCategories } from "../_repositories/get-product-categories";

export default async function ProductCreatePage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.PRODUCT_CREATE],
    user: user,
  });

  const { productCategories } = await getProductCategories();

  return (
    <SettingCard title="Tambah Produk Baru" breadcrumb={<PageBreadcrumb />}>
      <FormCreateProduct productCategories={productCategories} />
    </SettingCard>
  );
}

async function PageBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-blue-600">
        <BreadcrumbItem>
          <Link href={`/products`}>Produk</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Tambah Produk</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
