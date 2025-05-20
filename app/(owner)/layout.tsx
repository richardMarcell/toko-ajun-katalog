import { OwnerLayout } from "@/components/internal/OwnerLayout";
import { getAuthSession } from "@/lib/services/auth/get-user-authenticated";
import React from "react";

export default async function ProtectedOwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  return <OwnerLayout session={session}>{children}</OwnerLayout>;
}
