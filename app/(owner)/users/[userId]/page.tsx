import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slash } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "../_repositories/get-user";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";

export default async function UserShowPage({
  params,
}: {
  params: Promise<{
    userId: string;
  }>;
}) {
  const { userId } = await params;
  const { user } = await getUser({ userId });

  if (!user) return notFound();

  return (
    <div className="space-y-4">
      <SettingCard
        title="Edit Data Pengguna"
        breadcrumb={<PageBreadcrumb user={user} />}
      >
        <div className="w-full max-w-lg space-y-4">
          <div>
            <Label htmlFor="name">Nama Pengguna</Label>
            <Input
              value={user.name}
              id="name"
              name="name"
              autoComplete="off"
              placeholder="Masukkan nama pengguna"
              readOnly
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              value={user.email}
              id="email"
              name="email"
              type="email"
              autoComplete="off"
              placeholder="Masukkan email pengguna"
              readOnly
            />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              value={user.username}
              id="username"
              name="username"
              autoComplete="off"
              placeholder="Masukkan username"
              readOnly
            />
          </div>
        </div>

        <div className="flex max-w-lg justify-end">
          <Button asChild variant={"secondary"}>
            <Link href={"/users"}>Kembali</Link>
          </Button>
        </div>
      </SettingCard>
    </div>
  );
}

async function PageBreadcrumb({ user }: { user: User }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-blue-600">
        <BreadcrumbItem>
          <Link href={`/users`}>Pengguna</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>{user.id.toString()}</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
