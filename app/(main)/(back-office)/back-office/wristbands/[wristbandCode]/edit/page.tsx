import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Wristband } from "@/types/wristband";
import { Slash } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import FormEditWristband from "../../_components/form-edit-wristband";
import { getWristband } from "../../_repositories/get-wristband";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";

export default async function WristbandEditPage({
  params,
}: {
  params: Promise<{
    wristbandCode: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_WRISTBAND_EDIT],
    user: user,
  });

  const { wristbandCode } = await params;
  const { wristband } = await getWristband({ wristbandCode });

  if (!wristband) return notFound();

  return (
    <SettingCard
      title="Edit Data Gelang"
      breadcrumb={<PageBreadcrumb wristband={wristband} />}
    >
      <FormEditWristband wristband={wristband} />
    </SettingCard>
  );
}

async function PageBreadcrumb({ wristband }: { wristband: Wristband }) {
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
        <BreadcrumbItem>{wristband.code}</BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Edit</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
