import { Product } from "@/types/product";
import { Sale } from "@/types/sale";
import { SaleDetail } from "@/types/sale-detail";
import { SalesFoodCorner } from "@/types/sales-food-corner";

type SaleType = Pick<
  Sale,
  | "id"
  | "code"
  | "sales_status"
  | "discount_amount"
  | "tax_amount"
  | "grand_total"
  | "created_at"
>;

type SaleDetailType = Pick<SaleDetail, "id" | "qty" | "subtotal">;

type ProductType = Pick<Product, "name">;

type SalesFoodCornerType = Pick<
  SalesFoodCorner,
  "id" | "table_number" | "order_number" | "order_type"
>;

export type SaleWithRelations = SaleType & {
  salesDetails: (SaleDetailType & {
    product: ProductType;
  })[];
  salesFoodCorner: SalesFoodCornerType;
};

export type SaleWithRelationsMapped = {
  id: number;
  code: string;
  sales_status: string;
  discount_amount: string;
  tax_amount: string;
  grand_total: string;
  created_at: Date;
  table_number?: string | null;
  order_number: string;
  order_type: string;
  sales_details: {
    product_name: string;
    qty: number;
    subtotal: string;
  }[];
};
