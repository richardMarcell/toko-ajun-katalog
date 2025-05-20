import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { lockers, lockerWallet, wallets } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";
import { and, eq } from "drizzle-orm";
import { Slash } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import FormSelectLocker from "./_components/FormSelectLocker";

export default async function LockerRentEditPage({
  params,
}: {
  params: Promise<{ walletId: string; lockerWalletId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_EDIT],
    user: user,
  });

  const { walletId, lockerWalletId } = await params;

  const wallet = await db.query.wallets.findFirst({
    with: { lockerWallets: true },
    where: eq(wallets.id, BigInt(walletId)),
  });

  const lockerRent = await db.query.lockerWallet.findFirst({
    with: { locker: true },
    where: eq(lockerWallet.id, BigInt(lockerWalletId)),
  });

  if (!lockerRent || !wallet) return notFound();

  const lockerList = await db.query.lockers.findMany({
    where: and(eq(lockers.type, lockerRent.type)),
  });

  const { wristbandProduct } = await getWristbandProduct();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Pilih Loker</CardTitle>
        <BreadcrumbPage params={{ walletId: walletId }} />
      </CardHeader>
      <CardContent className="spacex-4">
        <FormSelectLocker
          wallet={wallet}
          lockerList={lockerList}
          lockerRent={lockerRent}
          walletId={walletId}
          wristbandProduct={wristbandProduct}
        />
      </CardContent>
    </Card>
  );
}

function BreadcrumbPage({ params }: { params: { walletId: string } }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href="/cashq-transaction">Transaksi Terbuka</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <Link href={`/cashq-transaction/${params.walletId}/locker-rent`}>
            Locker
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Pembayaran</BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Cetak Struk</BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Pilih Loker</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
