import { entryPassCustomers } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type EntryPassCustomer = InferSelectModel<typeof entryPassCustomers>;
