import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import mapCaptainOrderKitchen from "@/lib/services/print-receipt/map-captain-order-kitchen";
import { notFound, redirect } from "next/navigation";
import ButtonPrintKitchen from "./_components/button-print-kitchen";
import { getCaptainOrder } from "../../../_repositories/get-captain-order";

export default async function PrintKitchenPage({
  params,
}: {
  params: Promise<{
    captainOrderId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.DIMSUM_CAPTAIN_ORDER_KITCHEN],
    user: user,
  });

  const { captainOrderId } = await params;
  const { captainOrder } = await getCaptainOrder(captainOrderId);

  if (!captainOrder) return notFound();

  const kitchen = mapCaptainOrderKitchen({ captainOrder });

  return (
    <Card className="lg:w-1/2 xl:w-2/6">
      <CardContent className="flex w-full flex-col justify-center gap-4 p-4">
        <div className="w-full border p-4">
          <Table>
            <TableBody>
              <TableRow className="border-none font-bold">
                <TableCell>CO ID</TableCell>
                <TableCell>:</TableCell>
                <TableCell>{kitchen.code}</TableCell>
                <TableCell className="font-normal">{kitchen.outlet}</TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell>Waitress</TableCell>
                <TableCell>:</TableCell>
                <TableCell>{kitchen.op}</TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell>Table/Room</TableCell>
                <TableCell>:</TableCell>
                <TableCell>{kitchen.table_or_room_number}</TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell>Guest Name</TableCell>
                <TableCell>:</TableCell>
                <TableCell>{kitchen.customer_name}</TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell>Location</TableCell>
                <TableCell>:</TableCell>
                <TableCell>Kitchen</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table className="mt-4">
            <TableHeader>
              <TableRow className="border-y-2 border-y-black">
                <TableHead className="text-right font-bold">Qty</TableHead>
                <TableHead className="font-bold">Product</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border-b border-b-black">
              {kitchen.kitchen_details.map((detail, index) => {
                const isLastRecord =
                  index + 1 == captainOrder.captainOrderDetails.length;

                return (
                  <TableRow
                    className={isLastRecord ? "boorder-b" : "border-none"}
                    key={index}
                  >
                    <TableCell className="text-right">{detail.qty}</TableCell>
                    <TableCell>{detail.item}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <ButtonPrintKitchen
          kitchen={kitchen}
          redirectUrl={`/pos/dimsum/captain-order/${captainOrderId}/edit`}
        />
      </CardContent>
    </Card>
  );
}
