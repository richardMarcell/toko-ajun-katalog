import PaginationPage from "@/components/internal/PaginationPage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { Slash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import SettingCard from "../../../../../components/internal/SettingCard";
import { TableListProducts } from "./_components/table-list-products";
import { getProducts } from "./_repositories/get-products";
import { FilterProduct } from "./_components/filter-products";

export default async function ProductIndexPage({
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
    permissionNames: [PermissionEnum.BACK_OFFICE_PRODUCT_INDEX],
    user: user,
  });

  const productSearchParams = await searchParams;
  const { currentPage, currentPageSize, lastPage, offset, products } =
    await getProducts({ searchParams: productSearchParams });

  return (
    <SettingCard title="Kelola Produk" breadcrumb={<PageBreadcrumb />}>
      <FilterProduct />
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
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href={`/back-office`}>Back Office</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Produk</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
