import { stocks } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Stock = InferSelectModel<typeof stocks>;
