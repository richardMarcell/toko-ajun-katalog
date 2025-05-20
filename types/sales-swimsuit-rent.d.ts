import { salesSwimsuitRent } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type SalesSwimsuitRent = InferSelectModel<typeof salesSwimsuitRent>;
