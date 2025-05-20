import BoardSales from "@/components/internal/domains/pos/food-corner/sales/list/board-sales";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getSales } from "@/repositories/domain/pos/food-corner/sales/get-sales";
import { FileX } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SalesIndexPage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.FOOD_CORNER_SALES_INDEX],
    user: user,
  });

  const { sales } = await getSales();
  return (
    <div>
      <h1 className="text-2xl font-semibold">Order List</h1>

      {sales.length === 0 && (
        <div className="p-8 text-center">
          <FileX size={48} className="mx-auto mb-4 text-gray-500" />
          <h2 className="mb-2 text-2xl font-bold">Order Kosong</h2>
          <p className="mb-4 text-gray-600">
            Saat ini belum ada order food corner.
          </p>
        </div>
      )}

      <BoardSales sales={sales} />
    </div>
  );
}
