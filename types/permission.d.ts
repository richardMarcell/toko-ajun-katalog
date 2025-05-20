import { permissions } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Permission = InferSelectModel<typeof permissions>;
