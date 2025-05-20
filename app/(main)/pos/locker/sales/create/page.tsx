import { FormCreateSales } from "@/components/internal/domains/pos/locker/sales/create/form-create-sale";
import { TableListSale } from "@/components/internal/domains/pos/locker/sales/create/table-list-sale";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import getUnitBusinessPromo from "@/lib/services/sales/get-unit-business-promo";
import { getSalesTemporary } from "@/repositories/domain/pos/locker/sales/get-sales-temporary";
import { Slash } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function SalesCreatePage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.LOCKER_SALES_CREATE],
    user: user,
  });

  const userId = Number(user.id);
  const { entryTime, salesTemporary } = await getSalesTemporary(userId);

  if (!salesTemporary) return notFound();

  const { promoList } = await getUnitBusinessPromo(
    UnitBusinessSateliteQubuEnum.LOCKER,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Pembayaran Locker</CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent>
        <TableListSale salesTemporary={salesTemporary} entryTime={entryTime} />
        <FormCreateSales
          salesTemporary={salesTemporary}
          promoList={promoList}
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
          <Link href={`/pos/locker/order`}>Locker</Link>
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
