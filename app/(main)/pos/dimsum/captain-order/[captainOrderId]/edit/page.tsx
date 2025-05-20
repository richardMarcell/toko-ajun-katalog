import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { notFound, redirect } from "next/navigation";
import { isCaptainOrderCompleted } from "../../../_libs/is-captain-order-completed";
import { getCaptainOrder } from "../../../_repositories/get-captain-order";
import { getProductCategories } from "../../../_repositories/get-product-categories";
import { getProducts } from "../../../_repositories/get-products";
import { getPromos } from "../../../_repositories/get-promos";
import { CaptainOrderActionButton } from "./_components/captain-order-action-buttons";
import { CollapsibleCaptainOrderHeaderEditPage } from "./_components/collapsible-captain-order-header-edit-page";
import { PanelOrderMenu } from "./_components/panel-order-menu";
import { TabProductCategory } from "./_components/tab-product-category";

export default async function CaptainOrderEditPage({
  params,
  searchParams,
}: {
  params: Promise<{
    captainOrderId: string;
  }>;
  searchParams: Promise<{
    productCategoryId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.DIMSUM_CAPTAIN_ORDER_EDIT],
    user: user,
  });
  const { captainOrderId } = await params;
  const { productCategoryId } = await searchParams;

  const authorizeCaptainOrderCompleted =
    await isCaptainOrderCompleted(captainOrderId);

  const { captainOrder } = await getCaptainOrder(captainOrderId);

  if (!captainOrder) return notFound();
  if (!authorizeCaptainOrderCompleted) redirect("/pos/dimsum/tables");

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
