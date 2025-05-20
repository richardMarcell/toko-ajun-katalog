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
import FormEditIpLocation from "../../_components/form-edit-ip-location";
import {
  getIpLocation,
  IpLocationIncludeRelationship,
} from "../../_repositories/get-ip-location";

export default async function IpLocationEditPage({
  params,
}: {
  params: Promise<{
    ipLocationId: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_IP_LOCATION_EDIT],
    user: user,
  });

  const { ipLocationId } = await params;
  const { ipLocation } = await getIpLocation({
    ipLocationId: BigInt(ipLocationId),
  });

  const { permissionsList } = await getPermissionsList();

  if (!ipLocation) return notFound();

  return (
    <SettingCard
      title="Edit Lokasi IP"
      breadcrumb={<PageBreadcrumb ipLocation={ipLocation} />}
    >
      <FormEditIpLocation ipLocation={ipLocation} />

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
                {permissions.map((permission) => {
                  const isChecked = ipLocation.permissions
                    ? ipLocation.permissions.some(
                        (ipLocationPermission) =>
                          ipLocationPermission.id === permission.id,
                      )
                    : false;
                  return (
                    <CheckboxPermission
                      key={permission.id}
                      ipLocationId={ipLocation.id}
                      permission={permission}
                      isChecked={isChecked}
                    />
                  );
                })}
              </div>
            </div>
          ),
        )}
      </div>
    </SettingCard>
  );
}

async function PageBreadcrumb({
  ipLocation,
}: {
  ipLocation: IpLocationIncludeRelationship;
}) {
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
          <Link href={`/back-office/ip-locations`}>Lokasi IP</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>{ipLocation.id}</BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Edit</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
