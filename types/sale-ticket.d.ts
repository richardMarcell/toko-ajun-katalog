import { salesTicket } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type SaleTicket = InferSelectModel<typeof salesTicket>;
