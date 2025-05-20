import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { notFound, redirect } from "next/navigation";
import isAllowedRestoUnit from "../../../../_libs/authorize-resto-unit";
import { isCaptainOrderCompleted } from "../../../../_libs/is-captain-order-completed";
import { getCaptainOrder } from "../../../../_repositories/get-captain-order";
import { getProducts } from "../../../../_repositories/get-products";
import { CaptainOrderActionButton } from "./_components/captain-order-action-buttons";
import { CollapsibleCaptainOrderHeaderEditPage } from "./_components/collapsible-captain-order-header-edit-page";
import { PanelOrderMenu } from "./_components/panel-order-menu";
import { getPromos } from "../../../../_repositories/get-promos";
import { getProductCategories } from "../../../../_repositories/get-product-categories";
import { TabProductCategory } from "./_components/tab-product-category";

export default async function CaptainOrderEditPage({
  params,
  searchParams,
}: {
  params: Promise<{
    unit: string;
    captainOrderId: string;
  }>;
  searchParams: Promise<{
    productCategoryId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_EDIT],
    user: user,
  });
  const { unit, captainOrderId } = await params;
  const { productCategoryId } = await searchParams;

  const authorizedRestoUnit = isAllowedRestoUnit(unit);
  const authorizeCaptainOrderCompleted =
    await isCaptainOrderCompleted(captainOrderId);

  const { captainOrder } = await getCaptainOrder(captainOrderId);

  if (!authorizedRestoUnit || !captainOrder) return notFound();
  if (!authorizeCaptainOrderCompleted) redirect("/pos/resto/patio/tables");

  const { products, totalProducts } = await getProducts({ productCategoryId });
  const { promos } = await getPromos();
  const { productCategories } = await getProductCategories();

  return (
    <div className="space-y-4">
      <CollapsibleCaptainOrderHeaderEditPage captainOrder={captainOrder} />
      <CaptainOrderActionButton captainOrder={captainOrder} promos={promos} />

      <div className="flex gap-6">
        <TabProductCategory productCategories={productCategories} />

        <PanelOrderMenu
          captainOrder={captainOrder}
          products={products}
          totalProducts={totalProducts}
        />
      </div>
    </div>
  );
}
