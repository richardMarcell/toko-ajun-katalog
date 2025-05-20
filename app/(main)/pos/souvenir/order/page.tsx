import { PanelOrder } from "@/components/internal/domains/pos/souvenir/order/panel-order";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getProducts } from "@/repositories/domain/pos/souvenir/order/get-products";
import { getSalesTemporary } from "@/repositories/domain/pos/souvenir/sales/get-sales-temporary";
import { redirect } from "next/navigation";

export default async function OrderPage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SOUVENIR_SALES_CREATE],
    user: user,
  });

  const userId = Number(user.id);
  const { products, totalProducts } = await getProducts();
  const { salesTemporary } = await getSalesTemporary(userId);

  return (
    <PanelOrder
      products={products}
      salesTemporary={salesTemporary}
      totalProducts={totalProducts}
    />
  );
}
