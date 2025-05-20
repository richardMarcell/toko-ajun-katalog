import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { notFound, redirect } from "next/navigation";

import { db } from "@/db";
import { wallets } from "@/db/schema";
import { getGazeboProductList } from "@/repositories/domain/general/get-gazebo-product-list";
import { eq } from "drizzle-orm";
import PanelGazeboRentSalesCreate from "./_components/panel-gazebo-rent-sales-create";

export default async function LockerRentSalesCreatePage({
  params,
}: {
  params: Promise<{ walletId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_GAZEBO_RENT_CREATE],
    user: user,
  });

  const { walletId } = await params;

  const wallet = await db.query.wallets.findFirst({
    where: eq(wallets.id, BigInt(walletId)),
  });

  const { gazeboProductList } = await getGazeboProductList();

  if (!wallet || !gazeboProductList) return notFound();

  return (
    <PanelGazeboRentSalesCreate
      wallet={wallet}
      productList={gazeboProductList}
    />
  );
}
