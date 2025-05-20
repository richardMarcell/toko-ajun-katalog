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
import { walletWristband } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { WalletWristbandReturnStatusEnum } from "@/lib/enums/WalletWristbandReturnStatusEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { Slash } from "lucide-react";
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
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_BINDING_CASHQ_INDEX],
    user: user,
  });

  const { walletId } = await params;

  const walletWristbandList = await db.query.walletWristband.findMany({
    with: { wristband: true },
    where: and(
      eq(walletWristband.wallet_id, BigInt(walletId)),
      eq(walletWristband.return_status, WalletWristbandReturnStatusEnum.RENTED),
    ),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">List CashQ</CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="bg-qubu_blue" asChild>
          <Link
            href={`/cashq-transaction/${walletId}/binding-cashq/sales/create`}
          >
            + Tambah CashQ
          </Link>
        </Button>

        {walletWristbandList.length === 0 && (
          <div className="w-full py-12">
            <p className="text-center text-2xl font-extralight text-gray-400">
              No CashQ Bindings Found
            </p>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Tanggal & Waktu</TableHead>
              <TableHead>Kode Gelang</TableHead>
              <TableHead>Deposit</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {walletWristbandList.map((walletWristband, index) => (
              <TableRow key={walletWristband.wristband_code}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {formaterDate(walletWristband.created_at, "dateTime")}
                </TableCell>
                <TableCell>{walletWristband.wristband_code}</TableCell>
                <TableCell>{formatNumberToCurrency(25000)}</TableCell>
                <TableCell>{walletWristband.wristband.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
        <BreadcrumbItem>Binding CashQ</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
