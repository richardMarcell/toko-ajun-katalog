import { PanelOrder } from "@/components/internal/domains/pos/food-corner/order/panel-order";
import { TabTenant } from "@/components/internal/domains/pos/food-corner/order/tab-tenant";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { getProducts } from "@/repositories/domain/pos/food-corner/order/get-products";
import { getSalesTemporary } from "@/repositories/domain/pos/food-corner/sales/get-sales-temporary";
import { getTenants } from "@/repositories/domain/pos/food-corner/order/get-tenants";
import { redirect } from "next/navigation";
import { can } from "@/lib/services/permissions/can";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ tenantId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.FOOD_CORNER_SALES_CREATE],
    user: user,
  });

  const userId = Number(user.id);
  const { tenantId } = await searchParams;
  const { products, totalProducts } = await getProducts({ tenantId });
  const { tenants } = await getTenants();
  const { salesTemporary } = await getSalesTemporary(userId);

  return (
    <div className="flex gap-6">
      <TabTenant tenants={tenants} />

      <PanelOrder
        products={products}
        salesTemporary={salesTemporary}
        totalProducts={totalProducts}
      />
    </div>
  );
}
