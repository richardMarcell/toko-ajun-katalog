import PollingTrigger from "@/components/internal/domains/polling-trigger";
import SettingCard from "@/components/internal/SettingCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formaterDate } from "@/lib/utils";
import { Terminal } from "lucide-react";
import { SupportTicketIncludeRelationship } from "../_repositories/get-support-tickets";
import CheckboxMarkSupportTicketAsDone from "./checkbox-mark-support-ticket-as-done";

export function CardSectionSupportTicket({
  supportTickets,
}: {
  supportTickets: SupportTicketIncludeRelationship[];
}) {
  return (
    <SettingCard title="Tiket Panggilan IT Support">
      {supportTickets.length === 0 && (
        <div className="text-center text-xl italic">
          Belum ada tiket yang dikirimkan
        </div>
      )}
      <ListSupportTickets supportTickets={supportTickets} />

      <PollingTrigger />
    </SettingCard>
  );
}

function ListSupportTickets({
  supportTickets,
}: {
  supportTickets: SupportTicketIncludeRelationship[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {supportTickets.map((supportTicket) => (
        <Alert key={supportTicket.id} className="border-2">
          <Terminal className="h-4 w-4" />
          <AlertTitle className="text-lg font-bold">
            Lokasi IP : {supportTicket.ip_address} (
            {supportTicket.ipLocation.location_desc})
          </AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <div>
              Dilaporkan oleh <strong>{supportTicket.user.name}</strong> pada{" "}
              {formaterDate(supportTicket.created_at, "dateTime")}
            </div>
            <CheckboxMarkSupportTicketAsDone supportTicket={supportTicket} />
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
