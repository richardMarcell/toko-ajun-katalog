import { FormCreateEntryPassCustomer } from "@/components/internal/domains/entry-pass/create/form-create-entry-pass-customer";
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
import { getProducts } from "@/repositories/domain/entry-pass/get-products";
import { Slash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EntryPassCreatePage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.ENTRY_PASS_CREATE],
    user: user,
  });

  const { products } = await getProducts();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Entry Pass</CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent className="space-y-4">
        <FormCreateEntryPassCustomer products={products} user={user} />
      </CardContent>
    </Card>
  );
}

function BreadcrumbPage() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href={"/entry-pass"}>Transaksi Entry Pass</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <div>Daftar Entry Pass</div>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
