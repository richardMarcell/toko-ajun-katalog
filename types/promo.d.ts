import { promos } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Promo = InferSelectModel<typeof promos>;
