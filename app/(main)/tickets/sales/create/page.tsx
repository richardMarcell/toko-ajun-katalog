import { FormCreateSales } from "@/components/internal/domains/tickets/sales/create/form-create-sales";
import { TableListSale } from "@/components/internal/domains/tickets/sales/create/table-list-sale";
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

export default async function TicketSalesCreatePage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.TICKET_SALES_CREATE],
    user: user,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Pembayaran Tiket</CardTitle>
        <BreadCrumb />
      </CardHeader>
      <CardContent>
        <TableListSale />
        <FormCreateSales />
      </CardContent>
    </Card>
  );
}

function BreadCrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href={`/tickets/order`}>Pembelian Tiket</Link>
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
