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
import FormEditLocker from "../../_components/form-edit-locker";
import { getLocker } from "../../_repositories/get-locker";
import { Locker } from "@/types/locker";

export default async function LockerEditPage({
  params,
}: {
  params: Promise<{ lockerId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_LOCKER_EDIT],
    user: user,
  });

  const { lockerId } = await params;
  const { locker } = await getLocker({ lockerId });
  if (!locker) return notFound();

  return (
    <SettingCard
      title="Edit Loker"
      breadcrumb={<PageBreadcrumb locker={locker} />}
    >
      <FormEditLocker locker={locker} />
    </SettingCard>
  );
}

async function PageBreadcrumb({ locker }: { locker: Locker }) {
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
          <Link href={`/back-office/lockers`}>Loker</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>{locker.id}</BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Edit</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
