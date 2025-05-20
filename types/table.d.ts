import { tables } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Table = InferSelectModel<typeof tables>;
