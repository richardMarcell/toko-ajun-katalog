import { lockers } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Locker = InferSelectModel<typeof lockers>;
