import { booklets } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Booklet = InferSelectModel<typeof booklets>;
