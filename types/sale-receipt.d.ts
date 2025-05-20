import { SaleReceiptDetail } from "./sale-receipt-detail";

export type SaleReceipt = {
  id: number;
  unit_business_name: string;
  code: string | null;
  op: string;
  customer_name?: string;
  payment_method: string;
  date: Date;
  total_gross: number;
  discount_amount: number;
  tax_amount: number;
  is_print_as_copy: boolean;
  grand_total: number;
  footnote: string;
  table_number?: string;
  sales_details: SaleReceiptDetail[];
};
