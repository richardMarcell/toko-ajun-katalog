import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductConfig } from "@/lib/config/product-config";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import {
  getCaptainOrderComplimentCase,
  CaptainOrderComplimentEnum,
} from "@/lib/enums/CaptainOrderComplimentEnum";
import {
  getCaptainOrderOutletCase,
  CaptainOrderOutleEnum,
} from "@/lib/enums/CaptainOrderOutletEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { formatNumberToCurrency } from "@/lib/utils";
import { SpecialItemExtras } from "@/types/special-item-extras";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import isAllowedRestoUnit from "../../../_libs/authorize-resto-unit";
import { getCaptainOrder } from "../../../_repositories/get-captain-order";

export default async function CaptainOrderDetailPage({
  params,
}: {
  params: Promise<{
    captainOrderId: string;
    unit: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_SHOW],
    user: user,
  });

  const { unit, captainOrderId } = await params;
  const authorizedRestoUnit = isAllowedRestoUnit(unit);
  if (!authorizedRestoUnit) return notFound();

  const { captainOrder } = await getCaptainOrder(captainOrderId);
  if (!captainOrder) return notFound();

  const tableOrRoomNumber =
    {
      [CaptainOrderOutleEnum.PATIO_BISTRO]: captainOrder.table?.name ?? "-",
      [CaptainOrderOutleEnum.ROOM_SERVICES]: captainOrder.room?.name ?? "-",
    }[captainOrder.outlet] ?? "-";

  return (
    <div className="space-y-4">
      <div className="mt-4 grid w-full grid-cols-2 rounded-md border bg-white p-4">
        <Table>
          <TableBody>
            <TableRow className="border-none">
              <TableCell className="w-52 font-bold">Tipe Compliment</TableCell>
              <TableCell className="w-4">:</TableCell>
              <TableCell>
                {getCaptainOrderComplimentCase(
                  captainOrder.compliment as CaptainOrderComplimentEnum,
                )}
              </TableCell>
            </TableRow>
            <TableRow className="border-none">
              <TableCell className="w-52 font-bold">Captain Order ID</TableCell>
              <TableCell className="w-4">:</TableCell>
              <TableCell>{captainOrder.code}</TableCell>
            </TableRow>
            <TableRow className="border-none">
              <TableCell className="w-52 font-bold">Outlet</TableCell>
              <TableCell className="w-4">:</TableCell>
              <TableCell>
                {getCaptainOrderOutletCase(
                  captainOrder.outlet as CaptainOrderOutleEnum,
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table>
          <TableBody>
            <TableRow className="border-none">
              <TableCell className="w-52 font-bold">
                No. Meja / No. Kamar
              </TableCell>
              <TableCell className="w-4">:</TableCell>
              <TableCell>{tableOrRoomNumber}</TableCell>
            </TableRow>
            <TableRow className="border-none">
              <TableCell className="w-52 font-bold">Adult/Child</TableCell>
              <TableCell className="w-4">:</TableCell>
              <TableCell>
                {captainOrder.customer_adult_count}/
                {captainOrder.customer_child_count}
              </TableCell>
            </TableRow>
            <TableRow className="border-none">
              <TableCell className="w-52 font-bold">Waitress</TableCell>
              <TableCell className="w-4">:</TableCell>
              <TableCell>{captainOrder.userCreator.name}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-qubu_green bg-qubu_light_green p-4 text-lg font-medium text-qubu_green">
        <div>#Total Paid</div>
        <div>:</div>
        <div>
          {formatNumberToCurrency(Number(captainOrder.grand_total))}{" "}
          <span className="italic">(Include Tax)</span>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Transaction Details</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {captainOrder.captainOrderDetails.map((detail, index) => {
              const isSpecialItem =
                detail.product_id === ProductConfig.special_item.id;
              const extrasSpecialItem = detail.extras as SpecialItemExtras;

              const productName = isSpecialItem
                ? extrasSpecialItem.name
                : detail.product.name;
              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Image
                      src={detail.product.image}
                      alt={productName}
                      width={40}
                      height={40}
                    />
                    {productName}
                  </TableCell>
                  <TableCell>
                    <p className="line-clamp-1">{detail.product.description}</p>
                  </TableCell>
                  <TableCell className="text-center">{detail.qty}</TableCell>
                  <TableCell>{detail.note ? detail.note : "-"}</TableCell>
                  <TableCell>
                    {formatNumberToCurrency(Number(detail.subtotal))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="flex gap-4 pt-4">
          <div className="w-1/2 space-y-2 rounded-lg border bg-white p-4 text-lg">
            <div className="flex justify-between">
              <span>Tax</span>
              <span>
                {formatNumberToCurrency(Number(captainOrder.tax_amount))}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total Payment</span>
              <span>
                {formatNumberToCurrency(Number(captainOrder.grand_total))}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant={"outline"}>
              <Link href={`/pos/resto/patio/captain-order`}>Kembali</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
