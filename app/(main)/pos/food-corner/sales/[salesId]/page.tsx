import { BadgeOrderStatus } from "@/components/internal/domains/pos/food-corner/sales/detail/badge-order-status";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusEnum } from "@/lib/enums/OrderStatusEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { getSale } from "@/repositories/domain/pos/food-corner/sales/get-sale";
import { Printer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function DetailSalesPage({
  params,
}: {
  params: Promise<{ salesId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.FOOD_CORNER_SALES_SHOW],
    user: user,
  });

  const { salesId } = await params;
  const { sale } = await getSale(salesId);
  if (!sale) return notFound();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{sale.code}</h1>
        <h2 className="text-lg text-qubu_dark_gray">
          Order {sale.order_number}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-lg border border-gray-300 bg-white p-4 text-lg">
        <div>
          <div className="flex">
            <div className="w-20">No. Meja</div>
            <div className="font-bold">: {sale.table_number}</div>
          </div>
        </div>
        <div>
          <div className="flex">
            <div className="w-20">Date</div>
            <div className="font-bold">
              : {formaterDate(sale.created_at, "date")}
            </div>
          </div>
          <div className="flex">
            <div className="w-20">Time</div>
            <div className="font-bold">
              : {formaterDate(sale.created_at, "time")}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-qubu_green bg-qubu_light_green p-4 text-lg font-medium text-qubu_green">
        <div>#Total Paid</div>
        <div>:</div>
        <div>
          {formatNumberToCurrency(Number(sale.grand_total))}{" "}
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
              <TableHead>Tenant</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Kitchen Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sale.sales_details.map((detail, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Image
                    src={detail.product_image}
                    alt={detail.product_name}
                    width={40}
                    height={40}
                  />
                  {detail.product_name}
                </TableCell>
                <TableCell>
                  <p className="line-clamp-1">{detail.product_description}</p>
                </TableCell>
                <TableCell>{detail.tenant}</TableCell>
                <TableCell>{detail.qty}</TableCell>
                <TableCell>{detail.note ?? "-"}</TableCell>
                <TableCell>
                  {formatNumberToCurrency(Number(detail.subtotal))}
                </TableCell>
                <TableCell>
                  <BadgeOrderStatus
                    orderStatus={detail.order_status as OrderStatusEnum}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex gap-4 pt-4">
          <div className="w-1/2 space-y-2 rounded-lg border bg-white p-4 text-lg">
            <div className="flex justify-between">
              <span>Discount</span>
              <span>
                {formatNumberToCurrency(Number(sale.discount_amount))}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatNumberToCurrency(Number(sale.tax_amount))}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total Payment</span>
              <span>{formatNumberToCurrency(Number(sale.grand_total))}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/pos/food-corner/sales/${sale.id}/receipt`}>
                <Printer />
                <span>Cetak Struk</span>
              </Link>
            </Button>

            <Button asChild variant={"outline"}>
              <Link href={`/pos/food-corner/sales`}>Kembali</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
