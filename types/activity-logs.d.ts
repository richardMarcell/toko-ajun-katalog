import { activityLogs } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type ActivityLog = InferSelectModel<typeof activityLogs>;
