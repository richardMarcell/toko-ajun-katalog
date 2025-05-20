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
import { redirect } from "next/navigation";
import FormCreateIpLocation from "../_components/form-create-ip-location";

export default async function IpLocationCreatePage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_IP_LOCATION_CREATE],
    user: user,
  });

  return (
    <SettingCard title="Tambah Lokasi IP Baru" breadcrumb={<PageBreadcrumb />}>
      <FormCreateIpLocation />
    </SettingCard>
  );
}

async function PageBreadcrumb() {
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
        <BreadcrumbItem>Tambah Lokasi IP Baru</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
