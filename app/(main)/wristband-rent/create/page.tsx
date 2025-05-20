import PanelWristbandRent from "@/components/internal/domains/wristband-rent/create/panel-rent";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";
import { notFound, redirect } from "next/navigation";

export default async function CreatePage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.WRISTBAND_RENT_WALLET_CREATE],
    user: user,
  });

  const { wristbandProduct } = await getWristbandProduct();
  if (!wristbandProduct) return notFound();

  return <PanelWristbandRent wristbandProduct={wristbandProduct} />;
}
