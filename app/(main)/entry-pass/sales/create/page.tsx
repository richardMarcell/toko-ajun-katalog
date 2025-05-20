import { TableListEntryPassCustomerHistory } from "@/components/internal/domains/entry-pass/sales/create/table-list-entry-pass-customer-history";
import { FormCreateSales } from "@/components/internal/domains/entry-pass/sales/create/form-create-sales";
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
import { getEntryPassCustomerHistory } from "@/repositories/domain/entry-pass/get-entry-pass-customer-history";
import { Slash } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EntryPassCustomerHistoryIncludeRelations } from "@/types/domains/entry-pass/sales/create";

export default async function SalesCreatePage({
  searchParams,
}: {
  searchParams: Promise<{
    entryPassCustomerHistoryId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.ENTRY_PASS_SALES_CREATE],
    user: user,
  });

  const { entryPassCustomerHistoryId } = await searchParams;
  const { entryPassCustomerHistory } = await getEntryPassCustomerHistory(
    BigInt(entryPassCustomerHistoryId ?? ""),
  );

  if (!entryPassCustomerHistoryId || !entryPassCustomerHistory)
    return notFound();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Pembayaran Entry Pass</CardTitle>
        <BreadcrumbPage entryPassCustomerHistory={entryPassCustomerHistory} />
      </CardHeader>
      <CardContent>
        <TableListEntryPassCustomerHistory
          entryPassCustomerHistory={entryPassCustomerHistory}
        />
        <FormCreateSales entryPassCustomerHistory={entryPassCustomerHistory} />
      </CardContent>
    </Card>
  );
}

function BreadcrumbPage({
  entryPassCustomerHistory,
}: {
  entryPassCustomerHistory: EntryPassCustomerHistoryIncludeRelations;
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link
            href={`/entry-pass/${entryPassCustomerHistory.ep_customer_id}/edit`}
          >
            Entry Pass
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
