import { salesEntryPass } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type SalesEntryPass = InferSelectModel<typeof salesEntryPass>;
