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
import mapCaptainOrderBill from "@/lib/services/print-receipt/map-captain-order-bill";
import { formatNumberToCurrency } from "@/lib/utils";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { getCaptainOrder } from "../../../../_repositories/get-captain-order";
import ButtonPrintCaptainOrderBill from "./_components/button-print-captain-order-bill";

export default async function PrintCaptainOrderBillPage({
  params,
}: {
  params: Promise<{
    captainOrderId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_BILL],
    user: user,
  });

  const { captainOrderId } = await params;
  const { captainOrder } = await getCaptainOrder(captainOrderId);

  if (!captainOrder) return notFound();

  const captainOrderBill = mapCaptainOrderBill({ captainOrder });
  return (
    <Card className="lg:w-1/2">
      <CardContent className="flex w-full flex-col justify-center gap-4 p-4">
        <div className="w-full border p-4">
          <div className="flex w-full border-b-8 border-double border-black pb-4">
            <Image
              src={"/qubu-resort-icon.png"}
              alt="Logo Image"
              width={250}
              height={250}
              className="object-contain"
            />

            <div>
              <h1>QUBU RESORT</h1>
              <p className="text-sm">
                JL. Arteri Supadio, KM 12,8 No.10, Sungai Raya, Kabupaten Kubu
                Raya
              </p>
              <p className="text-sm">
                Pontianak - Kalimantan Barat - Indonesia -{" "}
              </p>
              <p className="text-sm">Phone: (0561) 762888 Fax: -</p>
            </div>
          </div>

          <div className="grid grid-cols-2 pt-4">
            <Table>
              <TableBody>
                <TableRow className="border-none">
                  <TableCell>CO</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{captainOrderBill.code}</TableCell>
                </TableRow>
                <TableRow className="border-none">
                  <TableCell>Table/Room</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{captainOrderBill.table_or_room_number}</TableCell>
                </TableRow>
                <TableRow className="border-none">
                  <TableCell>Guest Name</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{captainOrderBill.customer_name}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table>
              <TableBody>
                <TableRow className="border-none">
                  <TableCell>Waitress</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{captainOrderBill.op}</TableCell>
                </TableRow>
                <TableRow className="border-none">
                  <TableCell>#Adult/#Child</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>
                    {captainOrderBill.customer_adult_count}/
                    {captainOrderBill.customer_child_count}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <Table className="mt-4">
            <TableHeader>
              <TableRow className="border-y-2 border-y-black">
                <TableHead className="font-bold">Product</TableHead>
                <TableHead className="font-bold">Qty</TableHead>
                <TableHead className="font-bold">Sub Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {captainOrderBill.captain_order_bill_details.map(
                (detail, index) => {
                  const isLastRecord =
                    index + 1 ==
                    captainOrderBill.captain_order_bill_details.length;

                  return (
                    <TableRow
                      className={isLastRecord ? "boorder-b" : "border-none"}
                      key={index}
                    >
                      <TableCell>{detail.item}</TableCell>
                      <TableCell>{detail.qty}</TableCell>
                      <TableCell>
                        {formatNumberToCurrency(detail.subtotal)}
                      </TableCell>
                    </TableRow>
                  );
                },
              )}

              <TableRow className="border-none">
                <TableCell className="text-right font-bold">
                  Quantity: {captainOrderBill.total_qty}
                </TableCell>
                <TableCell>SubTotal</TableCell>
                <TableCell>
                  {formatNumberToCurrency(captainOrderBill.total_gross)}
                </TableCell>
              </TableRow>

              <TableRow className="border-none">
                <TableCell></TableCell>
                <TableCell className="border-b-2 border-b-black">
                  Discount
                </TableCell>
                <TableCell className="border-b-2 border-b-black">
                  {" "}
                  {formatNumberToCurrency(captainOrderBill.discount_amount)}
                </TableCell>
              </TableRow>

              <TableRow className="border-none">
                <TableCell></TableCell>
                <TableCell className="font-bold">Grand Total</TableCell>
                <TableCell className="font-bold">
                  {" "}
                  {formatNumberToCurrency(captainOrderBill.total_net)}
                </TableCell>
              </TableRow>

              <TableRow className="border-none">
                <TableCell>CC Charge:</TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell>{formatNumberToCurrency(0)}</TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell>Remark:</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex justify-center gap-2 pt-8">
            <div>
              <div className="flex">
                <span>{"("}</span>
                <div className="w-44 border-b border-b-black text-center">
                  {captainOrder.userCreator.name}
                </div>
                <span>{")"}</span>
              </div>
              <div className="text-center">Cashier</div>
            </div>
            <div>
              <div className="flex">
                <span>{"("}</span>
                <div className="w-44 border-b border-b-black text-center"></div>
                <span>{")"}</span>
              </div>
              <div className="text-center">Guest</div>
            </div>
          </div>
        </div>

        <ButtonPrintCaptainOrderBill
          captainOrderBill={captainOrderBill}
          redirectUrl={`/pos/resto/patio/captain-order/${captainOrderId}/edit`}
        />
      </CardContent>
    </Card>
  );
}
