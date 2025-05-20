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
import { Gazebo } from "@/types/gazebo";
import { Slash } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import FormEditGazebo from "../../_components/form-edit-gazebo";
import { getGazebo } from "../../_repositories/get-gazebo";

export default async function GazeboEditPage({
  params,
}: {
  params: Promise<{ gazeboId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_GAZEBO_EDIT],
    user: user,
  });

  const { gazeboId } = await params;
  const { gazebo } = await getGazebo({ gazeboId });
  if (!gazebo) return notFound();

  return (
    <SettingCard
      title="Edit Gazebo"
      breadcrumb={<PageBreadcrumb gazebo={gazebo} />}
    >
      <FormEditGazebo gazebo={gazebo} />
    </SettingCard>
  );
}

async function PageBreadcrumb({ gazebo }: { gazebo: Gazebo }) {
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
          <Link href={`/back-office/gazebos`}>Gazebo</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>{gazebo.id}</BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Edit</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
