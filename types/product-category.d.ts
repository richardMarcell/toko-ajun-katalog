import { productCategories } from "@/db/schema/product-categories";
import { InferSelectModel } from "drizzle-orm";

export type ProductCategory = InferSelectModel<typeof productCategories>;
