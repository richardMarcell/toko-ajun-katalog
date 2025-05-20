import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { gazebos, gazeboWallet, wallets } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { and, eq } from "drizzle-orm";
import { Slash } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import FormSelectGazebo from "./_components/FormSelectGazebo";

export default async function GazeboRentEditPage({
  params,
}: {
  params: Promise<{ walletId: string; gazeboWalletId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_GAZEBO_RENT_EDIT],
    user: user,
  });

  const { walletId, gazeboWalletId } = await params;

  const wallet = await db.query.wallets.findFirst({
    with: { gazeboWallets: true },
    where: eq(wallets.id, BigInt(walletId)),
  });

  const gazeboRent = await db.query.gazeboWallet.findFirst({
    with: { gazebo: true },
    where: eq(gazeboWallet.id, BigInt(gazeboWalletId)),
  });

  if (!gazeboRent || !wallet) return notFound();

  const gazeboList = await db.query.gazebos.findMany({
    where: and(eq(gazebos.type, gazeboRent.type)),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Pilih Gazebo</CardTitle>
        <BreadcrumbPage params={{ walletId: walletId }} />
      </CardHeader>
      <CardContent className="spacex-4">
        <FormSelectGazebo
          wallet={wallet}
          gazeboList={gazeboList}
          gazeboRent={gazeboRent}
          walletId={walletId}
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
          <Link href={`/cashq-transaction/${params.walletId}/gazebo-rent`}>
            Gazebo
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
        <BreadcrumbItem>Pilih Gazebo</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
