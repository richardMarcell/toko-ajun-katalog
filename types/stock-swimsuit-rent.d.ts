import { stockSwimsuitRent } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type StockSwimsuitRent = InferSelectModel<typeof stockSwimsuitRent>;
