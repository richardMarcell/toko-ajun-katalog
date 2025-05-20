import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { Slash } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import FormEditTenant from "../../_components/form-edit-tenant";
import { getTenant } from "../../_repositories/get-tenant";

export default async function TenantEditPage({
  params,
}: {
  params: Promise<{
    tenantId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_TENANT_EDIT],
    user: user,
  });

  const { tenantId } = await params;
  const { tenant } = await getTenant({ tenantId });
  if (!tenant) return notFound();

  return (
    <SettingCard
      title="Edit Tenant"
      breadcrumb={<PageBreadcrumb tenantId={tenant.id} />}
    >
      <FormEditTenant tenant={tenant} />
    </SettingCard>
  );
}

async function PageBreadcrumb({ tenantId }: { tenantId: bigint }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href={`/back-office`}>Back Office</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <Link href={`/back-office/tenants`}>Tenant</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>{tenantId}</BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Edit</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
