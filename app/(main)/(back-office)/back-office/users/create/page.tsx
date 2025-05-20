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
import FormCreateUser from "../_components/form-create-user";
import SettingCard from "@/components/internal/SettingCard";

export default async function UserCreatePage() {
  const roles = await db.query.roles.findMany({
    orderBy: [asc(roleSchema.description)],
  });

  return (
    <SettingCard title="Tambah Pengguna Baru" breadcrumb={<PageBreadcrumb />}>
      <FormCreateUser roles={roles} />
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
          <Link href={`/back-office/users`}>Pengguna</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Tambah Pengguna Baru</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
