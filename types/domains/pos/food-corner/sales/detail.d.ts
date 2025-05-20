import { Payment } from "@/types/payment";
import { Product } from "@/types/product";
import { Sale } from "@/types/sale";
import { SaleDetail } from "@/types/sale-detail";
import { SalesFoodCorner } from "@/types/sales-food-corner";
import { Tenant } from "@/types/tenant";

export type SaleWithRelations = Sale & {
  salesDetails: (SaleDetail & {
    product: Product & {
      tenant: Tenant;
    };
  })[];
  payments: Payment[];
  salesFoodCorner: SalesFoodCorner;
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
