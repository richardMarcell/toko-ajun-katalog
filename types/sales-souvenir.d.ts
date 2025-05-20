import { salesSouvenir } from "@/db/schema/sales-souvenir";
import { InferSelectModel } from "drizzle-orm";

export type SalesSouvenir = InferSelectModel<typeof salesSouvenir>;
