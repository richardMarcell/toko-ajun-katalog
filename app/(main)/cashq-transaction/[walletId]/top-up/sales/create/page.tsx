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

// NOTE: URL untuk pembayaran sewa gelang tetap menggunakan sales tetapi
// tidak melakukan proses penyimpanan ke table sales karena sewa tidak termasuk
// dalam pembelian.

export default async function TopUpSalesCreatePage({
  params,
}: {
  params: Promise<{ walletId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_TOP_UP_CREATE],
    user: user,
  });

  const { walletId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Pembayaran Top-Up CashQ</CardTitle>
        <BreadcrumbPage walletId={walletId} />
      </CardHeader>
      <CardContent className="space-y-4">
        <FormCreateSale walletId={walletId} />
      </CardContent>
    </Card>
  );
}

function BreadcrumbPage({ walletId }: { walletId: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href="/cashq-transaction">Transaksi Terbuka</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <Link href={`/cashq-transaction/${walletId}/top-up`}>Top-Up</Link>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Pembayaran</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
