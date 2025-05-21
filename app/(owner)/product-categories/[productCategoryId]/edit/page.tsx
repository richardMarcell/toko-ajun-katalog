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
import { ProductCategory } from "@/types/product-category";
import { Slash } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import FormEditProductCategory from "../../_components/form-edit-product-category";
import { getProductCategory } from "../../_repositories/get-product-category";

export default async function ProductCategoryEditPage({
  params,
}: {
  params: Promise<{
    productCategoryId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.PRODUCT_CATEGORY_EDIT],
    user: user,
  });

  const { productCategoryId } = await params;
  const { productCategory } = await getProductCategory({ productCategoryId });

  if (!productCategory) return notFound();

  return (
    <SettingCard
      title="Edit Data Kategori Produk"
      breadcrumb={<PageBreadcrumb productCategory={productCategory} />}
    >
      <FormEditProductCategory productCategory={productCategory} />
    </SettingCard>
  );
}

async function PageBreadcrumb({
  productCategory,
}: {
  productCategory: ProductCategory;
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-blue-600">
        <BreadcrumbItem>
          <Link href={`/product-categories`}>Kategori Produk</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>{productCategory.id}</BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Edit</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
