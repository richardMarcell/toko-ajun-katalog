import { supportTickets } from "@/db/schema/support-tickets";
import { InferSelectModel } from "drizzle-orm";

export type SupportTicket = InferSelectModel<typeof supportTickets>;
