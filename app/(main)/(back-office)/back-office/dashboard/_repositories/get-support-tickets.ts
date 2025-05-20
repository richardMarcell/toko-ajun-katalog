import { db } from "@/db";
import { supportTickets as supportTicketSchema } from "@/db/schema";
import { IpLocation } from "@/types/ip-location";
import { SupportTicket } from "@/types/support-ticket";
import { User } from "@/types/user";
import { eq } from "drizzle-orm";

export type SupportTicketIncludeRelationship = SupportTicket & {
  user: User;
  ipLocation: IpLocation;
};

export async function getSupportTickets(): Promise<{
  supportTickets: SupportTicketIncludeRelationship[];
}> {
  const supportTickets = await db.query.supportTickets.findMany({
    where: eq(supportTicketSchema.is_done, false),
    with: {
      ipLocation: true,
      user: true,
    },
  });

  return {
    supportTickets: supportTickets,
  };
}
