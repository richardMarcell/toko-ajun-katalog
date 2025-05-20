export type Sale = {
  created_at: Date;
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
  tenant: string;
  products: Product[];
};

export type Product = {
  name: string;
  price: string;
  qty: number;
  subtotal: string;
};
