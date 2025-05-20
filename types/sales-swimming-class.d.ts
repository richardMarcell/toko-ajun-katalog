import { salesSwimmingClass } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type SalesSwimmingClass = InferSelectModel<typeof salesSwimmingClass>;
