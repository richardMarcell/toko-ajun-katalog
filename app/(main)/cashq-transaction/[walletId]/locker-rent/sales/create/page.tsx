import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { notFound, redirect } from "next/navigation";

import { db } from "@/db";
import { wallets } from "@/db/schema";
import { getLockerProductList } from "@/repositories/domain/general/get-locker-product-list";
import { eq } from "drizzle-orm";
import PanelLockerRentSalesCreate from "./_components/panel-locker-rent-sales-create";

export default async function LockerRentSalesCreatePage({
  params,
}: {
  params: Promise<{ walletId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_CREATE],
    user: user,
  });

  const { walletId } = await params;

  const wallet = await db.query.wallets.findFirst({
    where: eq(wallets.id, BigInt(walletId)),
  });

  const { lockerProductList } = await getLockerProductList();

  if (!wallet || !lockerProductList) return notFound();

  return (
    <PanelLockerRentSalesCreate
      wallet={wallet}
      productList={lockerProductList}
    />
  );
}
