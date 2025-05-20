import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import Link from "next/link";
import FormCreateWristband from "../_components/form-create-wristband";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { redirect } from "next/navigation";
import { can } from "@/lib/services/permissions/can";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";

export default async function WristbandCreatePage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_WRISTBAND_CREATE],
    user: user,
  });

  return (
    <SettingCard title="Tambah Gelang Baru" breadcrumb={<PageBreadcrumb />}>
      <FormCreateWristband />
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
          <Link href={`/back-office/wristbands`}>Gelang</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Tambah Gelang Baru</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
