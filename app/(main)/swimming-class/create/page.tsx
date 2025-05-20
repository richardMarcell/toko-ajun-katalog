import { FormCreateSwimmingClassCustomer } from "@/components/internal/domains/swimming-class/create/form-create-swimming-class-customer";
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
import { getProducts } from "@/repositories/domain/swimming-class/get-products";
import { Slash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SwimmingClassCreatePage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SWIMMING_CLASS_CREATE],
    user: user,
  });

  const { products } = await getProducts();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Kelas Renang</CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent className="space-y-4">
        <FormCreateSwimmingClassCustomer products={products} user={user} />
      </CardContent>
    </Card>
  );
}

function BreadcrumbPage() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href={"/swimming-class"}>Transaksi Kelas Renang</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <div>Daftar Kelas Renang</div>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
