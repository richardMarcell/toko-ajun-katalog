import FilterCashqCode from "@/components/internal/domains/swimsuit-rent/return/list/filter-cashq-code";
import { TableListSale } from "@/components/internal/domains/swimsuit-rent/return/list/table-list-sale";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getSales } from "@/repositories/domain/swimsuit-rent/get-sales";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SwimsuitRentReturnIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ wristbandCode: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SWIMSUIT_RENT_RETURN_INDEX],
    user: user,
  });

  const { wristbandCode } = await searchParams;

  const { sales } = await getSales({ wristbandCode });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Pengembalian Baju Renang</CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent className="space-y-4">
        <FilterCashqCode />
        <TableListSale sales={sales} />
      </CardContent>
    </Card>
  );
}

function BreadcrumbPage() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href="/swimsuit-rent/return" className="underline">
            Lihat semua transaksi
          </Link>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
