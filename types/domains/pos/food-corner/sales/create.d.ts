export type SaleDetail = {
  product_id: number;
  qty: number;
  price: number;
  note?: string | null;

  tenant?: string | null; // Hanya digunakan sebagai informasi tambahan dan jika diperlukan
  product_name?: string; // Hanya digunakan sebagai informasi tambahan dan jika diperlukan
  product_image?: string; // Hanya digunakan sebagai informasi tambahan dan jika diperlukan
};

export type SalesTemporary = {
  order_type: string;
  table_number?: string | null;
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  sales_details: SaleDetail[];
  total_gross: number;
  total_net: number;
  grand_total: number;
};

export type Payment = {
  total_payment: number;
  change_amount: number;
  promo_code: string;
  method: string;
};
