import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { roles as roleSchema } from "@/db/schema/roles";
import { asc } from "drizzle-orm";
import SettingCard from "@/components/internal/SettingCard";
import FormEditUser from "../../_components/form-edit-user";
import { getUser, UserIncludeRelationship } from "../../_repositories/get-user";
import { notFound } from "next/navigation";
import FormEditPassword from "../../_components/form-edit-password";

export default async function UserEditPage({
  params,
}: {
  params: Promise<{
    userId: string;
  }>;
}) {
  const { userId } = await params;
  const { user } = await getUser({ userId });

  if (!user) return notFound();

  const roles = await db.query.roles.findMany({
    orderBy: [asc(roleSchema.description)],
  });

  return (
    <div className="space-y-4">
      <SettingCard
        title="Edit Data Pengguna"
        breadcrumb={<PageBreadcrumb user={user} />}
      >
        <FormEditUser roles={roles} user={user} />
      </SettingCard>

      <SettingCard title="Edit Password Pengguna">
        <FormEditPassword user={user} />
      </SettingCard>
    </div>
  );
}

async function PageBreadcrumb({ user }: { user: UserIncludeRelationship }) {
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
          <Link href={`/back-office/users`}>Pengguna</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>{user.id.toString()}</BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Edit</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
