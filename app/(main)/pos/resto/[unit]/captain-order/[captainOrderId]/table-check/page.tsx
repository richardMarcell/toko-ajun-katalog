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
import mapCaptainOrderTableCheck from "@/lib/services/print-receipt/map-captain-order-table-check";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { getCaptainOrder } from "../../../../_repositories/get-captain-order";
import ButtonPrintTableCheck from "./_components/button-print-table-check";

export default async function PrintTableCheckPage({
  params,
}: {
  params: Promise<{
    captainOrderId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_TABLE_CHECK],
    user: user,
  });

  const { captainOrderId } = await params;
  const { captainOrder } = await getCaptainOrder(captainOrderId);

  if (!captainOrder) return notFound();

  const tableCheck = mapCaptainOrderTableCheck({ captainOrder });

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
                  <TableCell>{tableCheck.code}</TableCell>
                </TableRow>
                <TableRow className="border-none">
                  <TableCell>Table/Room</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{tableCheck.table_or_room_number}</TableCell>
                </TableRow>
                <TableRow className="border-none">
                  <TableCell>Guest Name</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{tableCheck.customer_name}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table>
              <TableBody>
                <TableRow className="border-none">
                  <TableCell>Waitress</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{tableCheck.op}</TableCell>
                </TableRow>
                <TableRow className="border-none">
                  <TableCell>#Adult/#Child</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>
                    {tableCheck.customer_adult_count}/
                    {tableCheck.customer_child_count}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableCheck.table_check_details.map((detail, index) => {
                const isLastRecord =
                  index + 1 == tableCheck.table_check_details.length;

                return (
                  <TableRow
                    className={isLastRecord ? "boorder-b" : "border-none"}
                    key={index}
                  >
                    <TableCell>{detail.item}</TableCell>
                    <TableCell>{detail.qty}</TableCell>
                  </TableRow>
                );
              })}

              <TableRow className="border-none">
                <TableCell className="text-right font-bold">
                  Quantity: {tableCheck.total_qty}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <ButtonPrintTableCheck
          tableCheck={tableCheck}
          redirectUrl={`/pos/resto/patio/captain-order/${captainOrderId}/edit`}
        />
      </CardContent>
    </Card>
  );
}
