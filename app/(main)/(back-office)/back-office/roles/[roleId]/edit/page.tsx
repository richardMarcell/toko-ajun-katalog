import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import getPermissionsList from "@/lib/services/permissions/get-permissions-list";
import { Slash } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckboxPermission } from "../../_components/checkbox-permission";
import FormEditRole from "../../_components/form-edit-role";
import getRole from "../../_repositories/get-role";

export default async function RoleEditPage({
  params,
}: {
  params: Promise<{
    roleId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_ROLE_CREATE],
    user: user,
  });

  const { roleId } = await params;
  const { role } = await getRole({ roleId });

  const { permissionsList } = await getPermissionsList();

  if (!role) return notFound();

  return (
    <SettingCard
      title="Tambah Role Baru"
      breadcrumb={<PageBreadcrumb roleId={role.id} />}
    >
      <FormEditRole role={role} />

      <div className="col-span-2 space-y-4">
        <div>
          <Label
            htmlFor="permission"
            className="text-lg font-semibold text-gray-600"
          >
            Permission
          </Label>
        </div>

        {Object.entries(permissionsList).map(
          ([groupPermission, permissions], index) => (
            <div key={index}>
              <Label htmlFor="name" className="font-semibold text-gray-600">
                {groupPermission}
              </Label>
              <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2 lg:grid-cols-4">
                {permissions.map((permission) => (
                  <CheckboxPermission
                    key={permission.id}
                    roleId={role.id}
                    permission={permission}
                    isChecked={role.permissions.some(
                      (rolePermission) => rolePermission.id === permission.id,
                    )}
                  />
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </SettingCard>
  );
}

async function PageBreadcrumb({ roleId }: { roleId: bigint }) {
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
          <Link href={`/back-office/roles`}>Role</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>{roleId.toString()}</BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Edit</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
