import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { notFound, redirect } from "next/navigation";
import isAllowedRestoUnit from "../../_libs/authorize-resto-unit";
import { getCaptainOrders } from "../../_repositories/get-captain-orders";
import { ListCaptanOrders } from "./_components/list-captain-orders";

export default async function CaptainOrderListPage({
  params,
}: {
  params: Promise<{
    unit: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_INDEX],
    user: user,
  });

  const { unit } = await params;
  const authorizedRestoUnit = isAllowedRestoUnit(unit);
  if (!authorizedRestoUnit) return notFound();

  const { captainOrders } = await getCaptainOrders();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Order List</h1>
      <ListCaptanOrders captainOrders={captainOrders} />
    </div>
  );
}
