import { FormEditSwimmingClassCustomer } from "@/components/internal/domains/swimming-class/edit/form-edit-swimming-class-customer";
import { TableListCustomerSwimmingClassPaymentHistories } from "@/components/internal/domains/swimming-class/edit/table-list-customer-swimming-class-payment-histories";
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
import { getSwimmingClassCustomer } from "@/repositories/domain/swimming-class/get-swimming-class-customer";
import { Slash } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function SwimmingClassEditPage({
  params,
}: {
  params: Promise<{ swimmingClassCustomerId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SWIMMING_CLASS_EDIT],
    user: user,
  });

  const { swimmingClassCustomerId } = await params;
  const { swimmingClassCustomer } = await getSwimmingClassCustomer(
    swimmingClassCustomerId,
  );
  const { products } = await getProducts();

  if (!swimmingClassCustomer) return notFound();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Kelas Renang</CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent className="space-y-4">
        <FormEditSwimmingClassCustomer
          swimmingClassCustomer={swimmingClassCustomer}
          products={products}
          user={user}
        />

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Riwayat Pembayaran Kelas</h1>
          <TableListCustomerSwimmingClassPaymentHistories
            swimmingClassCustomer={swimmingClassCustomer}
          />
        </div>
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
          <div>Edit Kelas Renang</div>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
