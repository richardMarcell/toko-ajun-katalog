import { bookletPromo } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type BookletPromo = InferSelectModel<typeof bookletPromo>;
