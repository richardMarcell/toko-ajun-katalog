import { FormCreateSales } from "@/components/internal/domains/tickets-booklet-promo/sales/create/form-create-sales";
import { TableListSale } from "@/components/internal/domains/tickets-booklet-promo/sales/create/table-list-sale";
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
import authorizePromo from "../../_libs/authorize-promo";

export default async function TicketBookletPromoSalesCreatePage({
  searchParams,
}: {
  searchParams: Promise<{
    promoCode: string;
    bookletCode: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.TICKET_SALES_CREATE],
    user: user,
  });

  const { bookletCode, promoCode } = await searchParams;

  const isPromoAuthorize = await authorizePromo(promoCode, bookletCode);
  if (!promoCode || !isPromoAuthorize) redirect("/tickets-booklet-promo");

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
          <Link href={`/tickets-booklet-promo/order`}>Pembelian Tiket</Link>
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
