import { tenants } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Tenant = InferSelectModel<typeof tenants>;
