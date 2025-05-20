import { unitBusinessHasPromo } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type UnitBusinessHasPromo = InferSelectModel<
  typeof unitBusinessHasPromo
>;
