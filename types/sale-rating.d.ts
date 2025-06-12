import { saleRatings } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type SaleRating = InferSelectModel<typeof saleRatings>;
