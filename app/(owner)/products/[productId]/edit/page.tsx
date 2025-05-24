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
import { Product } from "@/types/product";
import { Slash } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import FormEditProduct from "../../_components/form-edit-product";
import { getProduct } from "../../_repositories/get-product";
import { getProductCategories } from "../../_repositories/get-product-categories";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{
    productId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.PRODUCT_EDIT],
    user: user,
  });

  const { productId } = await params;
  const { product } = await getProduct({ productId });

  if (!product) return notFound();

  const { productCategories } = await getProductCategories();

  const urlLocal = process.env.URL_LOCAL as string;

  return (
    <SettingCard
      title="Edit Data Produk"
      breadcrumb={<PageBreadcrumb product={product} />}
    >
      <FormEditProduct
        product={product}
        productCategories={productCategories}
        urlLocal={urlLocal}
      />
    </SettingCard>
  );
}

async function PageBreadcrumb({ product }: { product: Product }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-blue-600">
        <BreadcrumbItem>
          <Link href={`/products`}>Produk</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>{product.id}</BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Edit</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
