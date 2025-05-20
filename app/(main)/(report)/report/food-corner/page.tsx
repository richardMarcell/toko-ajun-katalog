import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getPaymentMethodCase,
  PaymentMethodEnum,
} from "@/lib/enums/PaymentMethodEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";
import getSalesGroupByUserCreated from "@/repositories/domain/report/food-corner/get-sales-group-by-user-created";
import { Printer, Slash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ReportFoodCornerPage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.REPORT_FOOD_CORNER],
    user: user,
  });

  const foodCornerReports = await getSalesGroupByUserCreated();

  // TODO Add component filter by date
  return (
    <SettingCard title="Laporan - Food Corner" breadcrumb={<PageBreadcrumb />}>
      <div className="flex justify-end">
        {/* TODO: button implement button download */}
        <Button>
          <Printer />
          Download Laporan
        </Button>
      </div>

      {foodCornerReports.map((report) => (
        <div key={report.created_by} className="space-y-4">
          <div className="grid w-1/6 grid-cols-2 gap-y-1">
            <div>Cashier</div>
            <div>: {report.user_name}</div>

            <div>Total CashQ</div>
            <div>: {formatNumberToCurrency(report.total_cashq)}</div>

            <div>Total Tunai</div>
            <div>: {formatNumberToCurrency(report.total_tunai)}</div>

            <div>Total Non Tunai</div>
            <div>: {formatNumberToCurrency(report.total_non_tunai)}</div>
          </div>

          <div>
            <h2 className="text-gray-500">Transaksi Harian</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black">#</TableHead>
                  <TableHead className="text-black">Tanggal & Waktu</TableHead>
                  <TableHead className="text-black">Metode</TableHead>
                  <TableHead className="text-black">Transaksi ID</TableHead>
                  <TableHead className="text-right text-black">Harga</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.sales.map((sale, index) => (
                  <TableRow key={sale.code}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {formaterDate(sale.sales_date, "dateTimeSecond")}
                    </TableCell>
                    <TableCell>
                      {getPaymentMethodCase(
                        sale.payment_method as PaymentMethodEnum,
                      )}
                    </TableCell>
                    <TableCell>{sale.code}</TableCell>
                    <TableCell className="text-right">
                      {formatNumberToCurrency(sale.grand_total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <h2 className="text-gray-500">Rekap Penjualan Menu</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black">#</TableHead>
                  <TableHead className="text-black">Item</TableHead>
                  <TableHead className="text-black">Terjual</TableHead>
                  <TableHead className="text-black">Harga</TableHead>
                  <TableHead className="text-black">Pendapatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.saleDetails.map((saleDetail, index) => (
                  <TableRow key={saleDetail.product_name}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Image
                        src={saleDetail.image}
                        alt={saleDetail.product_name}
                        width={40}
                        height={40}
                      />
                      {saleDetail.product_name}
                    </TableCell>
                    <TableCell>{saleDetail.qty}</TableCell>
                    <TableCell>
                      {formatNumberToCurrency(saleDetail.unit_price)}
                    </TableCell>
                    <TableCell>
                      {formatNumberToCurrency(saleDetail.subtotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="border border-black"></div>
        </div>
      ))}

      <Button variant="secondary">Kembali</Button>
    </SettingCard>
  );
}

function PageBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href={`/report`}>Laporan</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Food Corner</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
