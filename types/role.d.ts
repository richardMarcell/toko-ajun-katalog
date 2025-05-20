import { roles } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Role = InferSelectModel<typeof roles>