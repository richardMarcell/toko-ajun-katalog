import { PanelBindingCashQ } from "@/components/internal/domains/cashq-transaction/binding-cashq/sales/create/panel-binding-cashq";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";
import { notFound, redirect } from "next/navigation";

export default async function BindingCashqCreatePage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_BINDING_CASHQ_CREATE],
    user: user,
  });

  const { wristbandProduct } = await getWristbandProduct();
  if (!wristbandProduct) return notFound();

  return <PanelBindingCashQ wristbandProduct={wristbandProduct} />;
}
