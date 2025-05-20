import { entryPassCustomerHistories } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type EntryPassCustomerHistory = InferSelectModel<
  typeof entryPassCustomerHistories
>;
