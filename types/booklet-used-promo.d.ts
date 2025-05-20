import { bookletUsedPromos } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type BookletUsedPromo = InferSelectModel<typeof bookletUsedPromos>;
