import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { Slash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import FormCreateSale from "./_components/form-create-sale";

export default async function WristbandSalesCreatePage({
  params,
}: {
  params: Promise<{ walletId: string; lockerWalletId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [
      PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_UPDATE_ADD_WRISTBAND,
    ],
    user: user,
  });

  const { walletId, lockerWalletId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Pembayaran Sewa Gelang</CardTitle>
        <BreadcrumbPage
          params={{ walletId: walletId, lockerWalletId: lockerWalletId }}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <FormCreateSale walletId={walletId} lockerWalletId={lockerWalletId} />
      </CardContent>
    </Card>
  );
}

function BreadcrumbPage({
  params,
}: {
  params: { walletId: string; lockerWalletId: string };
}) {
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
        <BreadcrumbItem>
          <Link
            href={`/cashq-transaction/${params.walletId}/locker-rent/${params.lockerWalletId}/edit`}
          >
            Pilih Loker
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Pembayaran</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
