import PaginationPage from "@/components/internal/PaginationPage";
import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FilterProduct } from "./_components/filter-product";
import { TableListProducts } from "./_components/table-list-products";
import { getProductCategories } from "./_repositories/get-product-categories";
import { getProducts } from "./_repositories/get-products";

export default async function ProductIndexPage({
  searchParams,
}: {
  searchParams: Promise<
    BackOfficeSearchParams<{
      keyword: string;
      productCategoryId: string;
    }>
  >;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.PRODUCT_INDEX],
    user: user,
  });

  const productSearchParams = await searchParams;
  const { currentPage, currentPageSize, lastPage, offset, products } =
    await getProducts({ searchParams: productSearchParams });
  const { productCategories } = await getProductCategories();

  return (
    <SettingCard title="Kategori Produk" breadcrumb={<PageBreadcrumb />}>
      <Button className="bg-blue-600" asChild>
        <Link href={"/products/create"}>+ Tambah Produk Baru</Link>
      </Button>

      <FilterProduct productCategories={productCategories} />

      <TableListProducts products={products} offset={offset} />

      <PaginationPage
        currentPage={currentPage}
        currentPageSize={currentPageSize}
        lastPage={lastPage}
      />
    </SettingCard>
  );
}

function PageBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-blue-600">
        <BreadcrumbItem>Produk</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
