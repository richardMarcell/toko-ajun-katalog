import { OwnerLayout } from "@/components/internal/OwnerLayout";
import { getAuthSession } from "@/lib/services/auth/get-user-authenticated";

export default async function DashboardPage() {
  const session = await getAuthSession();

  return (
    <OwnerLayout session={session}>
      <div></div>
    </OwnerLayout>
  );
}
