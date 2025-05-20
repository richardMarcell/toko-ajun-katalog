import { salesDimsum } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type SalesDimsum = InferSelectModel<typeof salesDimsum>;
