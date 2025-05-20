import { TableListEntryPassCustomer } from "@/components/internal/domains/entry-pass/list/table-list-entry-pass-customer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getEntryPassCustomers } from "@/repositories/domain/entry-pass/get-entry-pass-customers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EntryPassIndexPage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.ENTRY_PASS_INDEX],
    user: user,
  });

  const isUserAuthorizeToMakePayment = await can({
    permissionNames: [PermissionEnum.ENTRY_PASS_SALES_CREATE],
    user: user,
    isRedirectToForbiddenPage: false,
  });

  const { entryPassCustomers } = await getEntryPassCustomers();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Entry Pass</CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="bg-qubu_blue" asChild>
          <Link href={"/entry-pass/create"}>+ Daftar Entry Pass</Link>
        </Button>
        <TableListEntryPassCustomer
          entryPassCustomers={entryPassCustomers}
          isUserAuthorizeToMakePayment={isUserAuthorizeToMakePayment}
        />
      </CardContent>
    </Card>
  );
}

function BreadcrumbPage() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <div>Transaksi Entry Pass</div>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
