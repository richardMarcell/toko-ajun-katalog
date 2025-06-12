import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SalesStatusEnum } from "@/lib/enums/SalesStatusEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { Slash } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DialogFormRatingSales } from "../_components/dialog-form-rating-sales";
import { FormEditSales } from "../_components/form-edit-sales";
import { TableListSaleDetails } from "../_components/table-list-sale-details";
import { getSale, SaleIncluRelationship } from "../_repositories/get-sale";

export default async function SalesDetailPage({
  params,
}: {
  params: Promise<{
    salesId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SALES_CREATE],
    user: user,
  });

  const { salesId } = await params;

  const { sale } = await getSale({ salesId });
  if (!sale) return notFound();

  const urlLocal = process.env.URL_LOCAL as string;

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Detail Pesanan</CardTitle>
          <BreadcrumbPage sale={sale} />
        </CardHeader>
        <CardContent>
          <TableListSaleDetails urlLocal={urlLocal} sale={sale} />
          <FormEditSales sale={sale} />

          {sale.status === SalesStatusEnum.CLOSED && !sale.saleRating && (
            <div className="mt-4 flex justify-end">
              <DialogFormRatingSales sale={sale} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function BreadcrumbPage({ sale }: { sale: SaleIncluRelationship }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-blue-600">
        <BreadcrumbItem>
          <Link href={`/order-list`}>List Pesanan</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <div>{sale.id}</div>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
