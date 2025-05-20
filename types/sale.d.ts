import { sales } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { SaleDetail } from "./sale-detail";
import { Product } from "./product";

export type Sale = InferSelectModel<typeof sales>;

type SalesDetailExtended = SaleDetail & {
  product: Product;
};

export type SalesIncludeRelation = Sale & {
  salesDetails: SalesDetailExtended[];
};
