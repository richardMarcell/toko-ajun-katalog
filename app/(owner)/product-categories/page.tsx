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
import { FilterProductCategory } from "./_components/filter-product-category";
import { TableListProductCategories } from "./_components/table-list-product-categories";
import PaginationPage from "@/components/internal/PaginationPage";
import { getProductCategories } from "./_repositories/get-product-categories";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";

export default async function ProductCategoriesIndexPage({
  searchParams,
}: {
  searchParams: Promise<
    BackOfficeSearchParams<{
      keyword: string;
    }>
  >;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.PRODUCT_CATEGORY_INDEX],
    user: user,
  });

  const productCategorySearchParams = await searchParams;
  const { currentPage, currentPageSize, lastPage, offset, productCategories } =
    await getProductCategories({ searchParams: productCategorySearchParams });

  return (
    <SettingCard title="Kategori Produk" breadcrumb={<PageBreadcrumb />}>
      <FilterProductCategory />

      <TableListProductCategories
        productCategories={productCategories}
        offset={offset}
      />

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
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>Kategori Produk</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
