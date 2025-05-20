import PaginationPage from "@/components/internal/PaginationPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  getSalesDisplayTransactionType,
  SalesTransactionTypeEnum,
} from "@/lib/enums/SalesTransactionType";
import {
  getDisplayUnitBusinessSatelite,
  UnitBusinessSateliteQubuEnum,
} from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { ListCollapse } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ButtonVoid from "./_components/button-void";
import FilterSales from "./_components/filter-sales";
import getReceiptUrl from "./_repositories/get-receipt-url";
import getSalesList from "./_repositories/get-sales-list";

export default async function SalesIndexPage({
  searchParams,
}: {
  searchParams: Promise<
    BackOfficeSearchParams<{
      keyword: string;
      date: string;
      businessUnits: string;
      transactionTypes: string;
    }>
  >;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [
      PermissionEnum.SALES_INDEX_ALL,
      PermissionEnum.SALES_INDEX,
    ],
    user: user,
  });

  const userSearchParams = await searchParams;
  const { salesList, currentPage, currentPageSize, lastPage } =
    await getSalesList({
      searchParams: {
        ...userSearchParams,
        keyword: userSearchParams.keyword,
        date: userSearchParams.date,
        businessUnits: userSearchParams.businessUnits
          ? userSearchParams.businessUnits.split(",")
          : [],
        transactionTypes: userSearchParams.transactionTypes
          ? userSearchParams.transactionTypes.split(",")
          : [],
      },
      user,
    });

  return (
    <Card className="px-4 py-5">
      <CardContent className="space-y-6 p-2">
        <h1 className="text-2xl font-semibold">Daftar Penjualan</h1>

        <FilterSales />

        <Table data-testid="sales-list-table">
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Tanggal & Waktu</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Metode Pembayaran</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesList.map(async (sale, index) => {
              const receiptUrl = await getReceiptUrl(sale);
              const paymentMethod = sale.payments
                .map((payment) =>
                  getPaymentMethodCase(
                    payment.payment_method as PaymentMethodEnum,
                  ),
                )
                .join(", ");

              return (
                <TableRow key={sale.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {formaterDate(sale.created_at, "dateTimeSecond")}
                  </TableCell>
                  <TableCell>{sale.code}</TableCell>
                  <TableCell>
                    {getDisplayUnitBusinessSatelite(
                      sale.unit_business as UnitBusinessSateliteQubuEnum,
                    )}
                  </TableCell>
                  <TableCell>
                    {getSalesDisplayTransactionType(
                      sale.transaction_type as SalesTransactionTypeEnum,
                    )}
                  </TableCell>
                  <TableCell>{paymentMethod}</TableCell>
                  <TableCell className="text-right">
                    {formatNumberToCurrency(Number(sale.grand_total))}
                  </TableCell>
                  <TableCell className="flex justify-center gap-2">
                    {receiptUrl ? (
                      <Button asChild>
                        <Link href={receiptUrl} target="_blank">
                          <ListCollapse />
                          Detail
                        </Link>
                      </Button>
                    ) : (
                      <Button disabled>
                        <ListCollapse />
                        Detail
                      </Button>
                    )}
                    <ButtonVoid
                      saleId={sale.id}
                      isDisabled={sale.is_void ? true : false}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <PaginationPage
          currentPage={currentPage}
          currentPageSize={currentPageSize}
          lastPage={lastPage}
        />
      </CardContent>
    </Card>
  );
}
