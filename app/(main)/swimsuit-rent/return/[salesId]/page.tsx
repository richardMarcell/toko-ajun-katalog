import { TableListSaleDetail } from "@/components/internal/domains/swimsuit-rent/return/show/table-list-sale-detail";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getSale } from "@/repositories/domain/swimsuit-rent/get-sale";
import { Slash } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

// NOTE: URL untuk detail pengembalian baju renang tetap akan menggunakan salesId
// agar bisa mendapatkan detail setiap data baju renang yang disewakan

export default async function SwimsuitRentReturnShowPage({
  params,
}: {
  params: Promise<{ salesId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SWIMSUIT_RENT_RETURN_SHOW],
    user: user,
  });

  const { salesId } = await params;
  const { sale } = await getSale({ salesId: BigInt(salesId) });

  if (!sale) return notFound();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Pengembalian Baju Renang</CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent className="space-y-4">
        <TableListSaleDetail sale={sale} />
        <Button asChild variant={"outline"}>
          <Link href={"/swimsuit-rent/return"}>Kembali</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function BreadcrumbPage() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href={"/swimsuit-rent/return"}>Pengembalian Baju Renang</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <div>Item yang Disewa</div>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
