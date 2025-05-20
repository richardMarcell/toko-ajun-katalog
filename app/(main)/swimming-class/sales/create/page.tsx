import { FormCreateSales } from "@/components/internal/domains/swimming-class/sales/create/form-create-sales";
import { TableListSwimmingClassCustomerHistory } from "@/components/internal/domains/swimming-class/sales/create/table-list-swimming-class-customer-history";
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
import { getSwimmingClassCustomerHistory } from "@/repositories/domain/swimming-class/get-swimming-class-customer-history";
import { SwimmingClassCustomerHistoryIncludeRelations } from "@/types/domains/swimming-class/sales/create";
import { Slash } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function SalesCreatePage({
  searchParams,
}: {
  searchParams: Promise<{
    swimmingClassCustomerHistoryId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SWIMMING_CLASS_SALES_CREATE],
    user: user,
  });

  const { swimmingClassCustomerHistoryId } = await searchParams;
  const { swimmingClassCustomerHistory } =
    await getSwimmingClassCustomerHistory(
      BigInt(swimmingClassCustomerHistoryId ?? ""),
    );

  if (!swimmingClassCustomerHistoryId || !swimmingClassCustomerHistory)
    return notFound();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Pembayaran Kelas Renang</CardTitle>
        <BreadcrumbPage
          swimmingClassCustomerHistory={swimmingClassCustomerHistory}
        />
      </CardHeader>
      <CardContent>
        <TableListSwimmingClassCustomerHistory
          swimmingClassCustomerHistory={swimmingClassCustomerHistory}
        />
        <FormCreateSales
          swimmingClassCustomerHistory={swimmingClassCustomerHistory}
        />
      </CardContent>
    </Card>
  );
}

function BreadcrumbPage({
  swimmingClassCustomerHistory,
}: {
  swimmingClassCustomerHistory: SwimmingClassCustomerHistoryIncludeRelations;
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link
            href={`/swimming-class/${swimmingClassCustomerHistory.sc_customer_id}/edit`}
          >
            Kelas Renang
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <div>Pembayaran</div>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
