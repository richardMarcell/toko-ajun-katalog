import { FormEditDetailData } from "@/components/internal/domains/entry-pass/edit/form-edit-detail-data";
import { FormEditGeneralData } from "@/components/internal/domains/entry-pass/edit/form-edit-general-data";
import { TableListCustomerEntryPassPaymentHistories } from "@/components/internal/domains/entry-pass/edit/table-list-customer-entry-pass-payment-histories";
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
import { getEntryPassCustomer } from "@/repositories/domain/entry-pass/get-entry-pass-customer";
import { getProducts } from "@/repositories/domain/entry-pass/get-products";
import { Slash } from "lucide-react";
import Link from "next/link";
import { forbidden, notFound, redirect } from "next/navigation";

export default async function EntryPassEditPage({
  params,
}: {
  params: Promise<{ entryPassCustomerId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  // General Data (Nama, NIK, Nomor Hp)
  const isUserCanEditGeneralData = await can({
    permissionNames: [
      PermissionEnum.ENTRY_PASS_EDIT_ALL,
      PermissionEnum.ENTRY_PASS_EDIT_GENERAL_DATA,
    ],
    user: user,
    isRedirectToForbiddenPage: false,
  });

  // Detail Data (Tipe Entry Pass, Tanggal Pendaftaran)
  const isUserCanEditDetailData = await can({
    permissionNames: [
      PermissionEnum.ENTRY_PASS_EDIT_ALL,
      PermissionEnum.ENTRY_PASS_EDIT_DETAIL_DATA,
    ],
    user: user,
    isRedirectToForbiddenPage: false,
  });

  const isUserAuthorizeToMakePayment = await can({
    permissionNames: [PermissionEnum.ENTRY_PASS_SALES_CREATE],
    user: user,
    isRedirectToForbiddenPage: false,
  });

  if (!isUserCanEditDetailData && !isUserCanEditGeneralData) return forbidden();

  const { entryPassCustomerId } = await params;
  const { entryPassCustomer } = await getEntryPassCustomer(entryPassCustomerId);
  const { products } = await getProducts();

  if (!entryPassCustomer) return notFound();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Entry Pass</CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent className="space-y-4">
        <FormEditGeneralData
          isUserCanEditGeneralData={isUserCanEditGeneralData}
          entryPassCustomer={entryPassCustomer}
        />

        <FormEditDetailData
          isUserCanEditDetailData={isUserCanEditDetailData}
          entryPassCustomer={entryPassCustomer}
          products={products}
          user={user}
        />

        {isUserAuthorizeToMakePayment && (
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Riwayat Pembayaran</h1>
            <TableListCustomerEntryPassPaymentHistories
              entryPassCustomer={entryPassCustomer}
            />
          </div>
        )}
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
          <div>Edit Entry Pass</div>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
