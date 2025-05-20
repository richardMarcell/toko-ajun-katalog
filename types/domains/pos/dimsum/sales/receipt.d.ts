export type Sale = {
  created_at: Date;
  customer_name?: string | null;
  payment_method: string;
  table_number?: string | null;
  total_gross: string;
  discount_amount: string;
  total_net: string;
  tax_amount: string;
  grand_total: string;
  total_payment: string;
  change_amount: string;
  unit_business: string;
  sales_details: SaleDetail[];
};

export type SaleDetail = {
  product_name: string;
  price: string;
  qty: number;
  subtotal: string;
};
