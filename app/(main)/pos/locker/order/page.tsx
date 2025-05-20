import { PanelOrder } from "@/components/internal/domains/pos/locker/order/panel-order";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getProducts } from "@/repositories/domain/pos/locker/order/get-products";
import { getSalesTemporary } from "@/repositories/domain/pos/locker/sales/get-sales-temporary";
import { redirect } from "next/navigation";

export default async function OrderPage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.LOCKER_SALES_CREATE],
    user: user,
  });

  const { products, totalProducts } = await getProducts();
  const { salesTemporary } = await getSalesTemporary(Number(user.id));

  return (
    <PanelOrder
      products={products}
      salesTemporary={salesTemporary}
      totalProducts={totalProducts}
    />
  );
}
