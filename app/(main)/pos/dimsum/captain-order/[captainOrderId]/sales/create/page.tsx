import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { notFound, redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Slash } from "lucide-react";
import { CaptainOrderIncludeRelationship } from "../../edit/_types/edit";
import { TableListOrderedProduct } from "./_components/table-list-ordered-product";
import { FormCreateSales } from "./_components/form-create-sale";
import getUnitBusinessPromo from "@/lib/services/sales/get-unit-business-promo";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { getCaptainOrder } from "../../../../_repositories/get-captain-order";
import { isCaptainOrderCompleted } from "../../../../_libs/is-captain-order-completed";

const BASE_URL = "/pos/dimsum";

export default async function SalesCreatePage({
  params,
}: {
  params: Promise<{
    captainOrderId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.DIMSUM_SALES_CREATE],
    user: user,
  });

  const { captainOrderId } = await params;

  const { captainOrder } = await getCaptainOrder(captainOrderId);
  if (!captainOrder) return notFound();

  const authorizeCaptainOrderCompleted =
    await isCaptainOrderCompleted(captainOrderId);
  if (!authorizeCaptainOrderCompleted) redirect(`${BASE_URL}/tables`);

  const { promoList } = await getUnitBusinessPromo(
    UnitBusinessSateliteQubuEnum.DIMSUM,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Pembayaran</CardTitle>
        <BreadcrumbPage captainOrder={captainOrder} />
      </CardHeader>
      <CardContent>
        <TableListOrderedProduct captainOrder={captainOrder} />
        <FormCreateSales captainOrder={captainOrder} promoList={promoList} />
      </CardContent>
    </Card>
  );
}

function BreadcrumbPage({
  captainOrder,
}: {
  captainOrder: CaptainOrderIncludeRelationship;
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>Pesanan</BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <Link href={`${BASE_URL}/tables`}>Open Captain Order</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <Link
            href={`${BASE_URL}/captain-order/${captainOrder.id.toString()}/edit`}
          >
            Captain Order
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Pembayaran</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
