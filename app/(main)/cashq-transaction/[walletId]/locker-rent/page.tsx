import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { lockerWallet } from "@/db/schema";
import {
  getLockerDisplayType,
  LockerTypeEnum,
} from "@/lib/enums/LockerTypeEnum";
import {
  getLockerWalletPaymentSatatusCase,
  LockerWalletPaymentStatusEnum,
} from "@/lib/enums/LockerWalletPaymentStatusEnum";
import { LockerWalletStatusEnum } from "@/lib/enums/LockerWalletStatusEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { getLockerFamilyProduct } from "@/repositories/domain/general/get-locker-family-product";
import { getLockerStandardProduct } from "@/repositories/domain/general/get-locker-standard-product";
import { and, eq } from "drizzle-orm";
import { Edit, Slash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LockerRentIndexPage({
  params,
}: {
  params: Promise<{ walletId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_INDEX],
    user: user,
  });

  const { walletId } = await params;

  const lockerWalletList = await db.query.lockerWallet.findMany({
    with: {
      locker: {
        with: {
          product: true,
        },
      },
    },
    where: and(
      eq(lockerWallet.wallet_id, BigInt(walletId)),
      eq(lockerWallet.status, LockerWalletStatusEnum.OPEN),
    ),
  });

  const { lockerStandard } = await getLockerStandardProduct();
  if (!lockerStandard) throw new Error("Product locker standard not found");

  const { lockerFamily } = await getLockerFamilyProduct();
  if (!lockerFamily) throw new Error("Product family standard not found");

  const getLockerPrice = (lockerType: LockerTypeEnum): number | null => {
    if (lockerType === LockerTypeEnum.FAMILY) {
      return Number(lockerFamily.price);
    }

    if (lockerType === LockerTypeEnum.STANDARD) {
      return Number(lockerStandard.price);
    }

    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">List Loker</CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="bg-qubu_blue" asChild>
          <Link
            href={`/cashq-transaction/${walletId}/locker-rent/sales/create`}
          >
            + Tambah Loker
          </Link>
        </Button>

        {lockerWalletList.length === 0 ? (
          <div className="w-full py-12">
            <p className="text-center text-2xl font-extralight text-gray-400">
              No Locker Selected
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Tanggal & Waktu</TableHead>
                <TableHead>Tipe Loker</TableHead>
                <TableHead>No. Loker</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {lockerWalletList.map((lockerWallet, index) => {
                const lockerPrice = getLockerPrice(
                  lockerWallet.type as LockerTypeEnum,
                );
                return (
                  <TableRow key={lockerWallet.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {formaterDate(lockerWallet.created_at, "dateTime")}
                    </TableCell>
                    <TableCell>
                      {getLockerDisplayType(
                        lockerWallet.type as LockerTypeEnum,
                      )}
                    </TableCell>
                    <TableCell>
                      {lockerWallet.locker ? lockerWallet.locker.label : "-"}
                    </TableCell>
                    <TableCell>
                      {lockerPrice
                        ? formatNumberToCurrency(lockerPrice)
                        : formatNumberToCurrency(0)}
                    </TableCell>
                    <TableCell>
                      {getLockerWalletPaymentSatatusCase(
                        lockerWallet.payment_status as LockerWalletPaymentStatusEnum,
                      )}
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <Button asChild>
                        <Link
                          className="flex items-center justify-center"
                          href={`/cashq-transaction/${walletId}/locker-rent/${lockerWallet.id}/edit`}
                        >
                          <Edit />
                          <span>Edit</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function BreadcrumbPage() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href="/cashq-transaction">Transaksi Terbuka</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Locker</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
