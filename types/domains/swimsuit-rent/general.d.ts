export type Product = {
  id: bigint;
  name: string;
  code: string;
  price: string;
  image: string;
  description: string;
  stock_qty: number | null;
};

export type SwimsuitRentTemporary = {
  customer_name: string;
  customer_phone_number: string;
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  sales_details: SaleDetail[];
  total_gross: number;
  total_net: number;
  grand_total: number;
  created_at: Date;
  wristband_code?: string;
};

export type SaleDetail = {
  product_id: number;
  product_code: string;
  product_description: string;
  product_name: string;
  product_image: string;
  product_stock_qty: number;
  qty: number;
  price: number;
};
