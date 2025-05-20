import ButtonSupportTicket from "@/components/internal/ButtonSupportTicket";
import { MainLayout } from "@/components/internal/MainLayout";
import TailwindIndicator from "@/components/internal/TailwindIndicator";
import { getAuthSession } from "@/lib/services/auth/get-user-authenticated";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Check functional stateful auth before refactore
  // TODO: Change main layout to context
  const session = await getAuthSession();

  return (
    <MainLayout session={session}>
      {children}

      <TailwindIndicator />
      <ButtonSupportTicket />
    </MainLayout>
  );
}
