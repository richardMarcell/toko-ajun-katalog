import { salesDetails } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type SaleDetail = InferSelectModel<typeof salesDetails>;
