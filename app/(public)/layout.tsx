import { PublicLayout } from "@/components/internal/PublicLayout";
import { getAuthSession } from "@/lib/services/auth/get-user-authenticated";
import React from "react";

export default async function ProtectedPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  return <PublicLayout session={session}>{children}</PublicLayout>;
}
