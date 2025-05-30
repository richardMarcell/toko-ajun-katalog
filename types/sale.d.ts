import { sales } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Sale = InferSelectModel<typeof sales>;
