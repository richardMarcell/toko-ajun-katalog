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
import { notFound, redirect } from "next/navigation";
import { FormEditSales } from "../../_components/form-edit-sales";
import { TableListSaleDetails } from "../../_components/table-list-sale-details";
import { getSale, SaleIncluRelationship } from "../../_repositories/get-sale";

export default async function SalesEditPage({
  params,
}: {
  params: Promise<{
    salesId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SALES_EDIT],
    user: user,
  });

  const { salesId } = await params;

  const { sale } = await getSale({ salesId });
  if (!sale) return notFound();

  const urlLocal = process.env.URL_LOCAL as string;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Edit Penjualan</CardTitle>
        <BreadcrumbPage sale={sale} />
      </CardHeader>
      <CardContent>
        <TableListSaleDetails urlLocal={urlLocal} sale={sale} />
        <FormEditSales sale={sale} />
      </CardContent>
    </Card>
  );
}

function BreadcrumbPage({ sale }: { sale: SaleIncluRelationship }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-blue-600">
        <BreadcrumbItem>
          <Link href={`/sales`}>Penjualan</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <div>{sale.id}</div>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <div>Edit</div>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
