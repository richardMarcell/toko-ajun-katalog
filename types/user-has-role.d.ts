import { userHasRoles } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type UserHasRole = InferSelectModel<typeof userHasRoles>;
