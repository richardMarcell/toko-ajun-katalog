import { salesFoodCorner } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type SalesFoodCorner = InferSelectModel<typeof salesFoodCorner>;
