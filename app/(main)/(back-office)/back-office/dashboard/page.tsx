import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { redirect } from "next/navigation";
import { CardSectionDashboard } from "./_components/card-section-dashboard";
import { CardSectionSupportTicket } from "./_components/card-section-support-ticket";
import { getQuickStatsData } from "./_repositories/get-quick-stats-data";
import { getSupportTickets } from "./_repositories/get-support-tickets";

export default async function BackOfficeDashboardPage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_DASHBOARD],
    user: user,
  });

  const {
    customers,
    totalCustomers,
    totalCustomersNotRefunded,
    totalWristbandsHasNotReturned,
  } = await getQuickStatsData();

  const { supportTickets } = await getSupportTickets();

  return (
    <div className="space-y-4">
      <CardSectionDashboard
        customers={customers}
        totalCustomers={totalCustomers}
        totalCustomersNotRefunded={totalCustomersNotRefunded}
        totalWristbandsHasNotReturned={totalWristbandsHasNotReturned}
      />

      <CardSectionSupportTicket supportTickets={supportTickets} />
    </div>
  );
}
