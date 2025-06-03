import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { FilterProduct } from "./_components/filter-product";
import { ProductCard } from "./_components/product-card";
import { getProductCategories } from "./_repositories/get-product-categories";
import { getProducts } from "./_repositories/get-products";
import { can } from "@/lib/services/permissions/can";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{
    keyword: string;
    productCategoryId: string;
  }>;
}) {
  const user = await getUserAuthenticated();

  const productSearchParams = await searchParams;
  const { products } = await getProducts({ searchParams: productSearchParams });
  const { productCategories } = await getProductCategories();

  const isUserAuthorizeToShop = await can({
    permissionNames: [PermissionEnum.SALES_CREATE],
    user: user,
    isRedirectToForbiddenPage: false,
  });

  return (
    <div className="bg-white px-6 py-4 md:px-12">
      <h1 className="mb-8 text-center text-3xl font-bold text-[#204B4E]">
        Daftar Produk
      </h1>
      <FilterProduct productCategories={productCategories} />

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard isUserAuthorizeToShop={isUserAuthorizeToShop} key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center text-2xl font-medium italic">
          Tidak ada produk yang ditemukan
        </div>
      )}
    </div>
  );
}
