import { PanelSwimsuitRent } from "@/components/internal/domains/swimsuit-rent/create/panel-swimsuit-rent";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getProducts } from "@/repositories/domain/swimsuit-rent/get-products";
import getWallet from "@/repositories/domain/swimsuit-rent/get-wallet";
import { redirect } from "next/navigation";

export default async function SwimsuitRentCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ wristbandCode: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SWIMSUIT_RENT_SALES_CREATE],
    user: user,
  });

  const { wristbandCode } = await searchParams;

  const { wallet } = await getWallet({
    wristbandCode: wristbandCode as string,
  });

  const { products, totalProducts } = await getProducts();

  return (
    <PanelSwimsuitRent
      products={products}
      totalProducts={totalProducts}
      wallet={wallet}
    />
  );
}
