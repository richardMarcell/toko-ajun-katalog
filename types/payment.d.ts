import { payments } from "@/db/schema/payments";
import { InferSelectModel } from "drizzle-orm";

export type Payment = InferSelectModel<typeof payments>;
