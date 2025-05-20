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
import { gazeboWallet } from "@/db/schema";
import {
  GazeboTypeEnum,
  getGazeboDisplayType,
} from "@/lib/enums/GazeboTypeEnum";
import {
  GazeboWalletPaymentStatusEnum,
  getGazeboWalletPaymentSatatusCase,
} from "@/lib/enums/GazeboWalletPaymentStatusEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { getGazeboFamilyProduct } from "@/repositories/domain/general/get-gazebo-family-product";
import { getGazeboVipProduct } from "@/repositories/domain/general/get-gazebo-vip-product";
import { and, eq } from "drizzle-orm";
import { Edit, Slash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function GazeboRentIndexPage({
  params,
}: {
  params: Promise<{ walletId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_GAZEBO_RENT_INDEX],
    user: user,
  });

  const { walletId } = await params;

  const gazeboWalletList = await db.query.gazeboWallet.findMany({
    with: {
      gazebo: {
        with: {
          product: true,
        },
      },
    },
    where: and(eq(gazeboWallet.wallet_id, BigInt(walletId))),
  });

  const { gazeboFamily } = await getGazeboFamilyProduct();
  if (!gazeboFamily) throw new Error("Product gazebo family not found");

  const { gazeboVip } = await getGazeboVipProduct();
  if (!gazeboVip) throw new Error("Product gazebo VIP not found");

  const getGazeboPrice = (lockerType: GazeboTypeEnum): number | null => {
    if (lockerType === GazeboTypeEnum.FAMILY) {
      return Number(gazeboFamily.price);
    }

    if (lockerType === GazeboTypeEnum.VIP) {
      return Number(gazeboVip.price);
    }

    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">List Gazebo</CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="bg-qubu_blue" asChild>
          <Link
            href={`/cashq-transaction/${walletId}/gazebo-rent/sales/create`}
          >
            + Tambah Gazebo
          </Link>
        </Button>

        {gazeboWalletList.length === 0 ? (
          <div className="w-full py-12">
            <p className="text-center text-2xl font-extralight text-gray-400">
              No Gazebo Booked
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Tanggal & Waktu</TableHead>
                <TableHead>Tipe Gazebo</TableHead>
                <TableHead>No. Gazebo</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {gazeboWalletList.map((gazeboWallet, index) => {
                const gazeboPrice = getGazeboPrice(
                  gazeboWallet.type as GazeboTypeEnum,
                );
                return (
                  <TableRow key={gazeboWallet.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {formaterDate(gazeboWallet.created_at, "dateTime")}
                    </TableCell>
                    <TableCell>
                      {getGazeboDisplayType(
                        gazeboWallet.type as GazeboTypeEnum,
                      )}
                    </TableCell>
                    <TableCell>
                      {gazeboWallet.gazebo ? gazeboWallet.gazebo.label : "-"}
                    </TableCell>
                    <TableCell>
                      {gazeboPrice
                        ? formatNumberToCurrency(gazeboPrice)
                        : formatNumberToCurrency(0)}
                    </TableCell>
                    <TableCell>
                      {getGazeboWalletPaymentSatatusCase(
                        gazeboWallet.payment_status as GazeboWalletPaymentStatusEnum,
                      )}
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <Button asChild>
                        <Link
                          className="flex items-center justify-center"
                          href={`/cashq-transaction/${walletId}/gazebo-rent/${gazeboWallet.id}/edit`}
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
        <BreadcrumbItem>Gazebo</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
