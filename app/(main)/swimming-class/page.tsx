import { TableListSwimmingClassCustomer } from "@/components/internal/domains/swimming-class/list/table-list-swimming-class-customer";
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
import { getSwimmingClassCustomers } from "@/repositories/domain/swimming-class/get-swimming-class-customers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SwimmingClassIndexPage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SWIMMING_CLASS_INDEX],
    user: user,
  });

  const { swimmingClassCustomers } = await getSwimmingClassCustomers();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Kelas Renang</CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="bg-qubu_blue" asChild>
          <Link href={"/swimming-class/create"}>+ Daftar Kelas</Link>
        </Button>
        <TableListSwimmingClassCustomer
          swimmingClassCustomers={swimmingClassCustomers}
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
          <div>Transaksi Kelas Renang</div>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
