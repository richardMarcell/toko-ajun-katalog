export type Product = {
  id: bigint;
  name: string;
  price: string;
  image: string;
  description: string;
  stock_qty: number | null;
};

export type SaleDetail = {
  product_id: number;
  qty: number;
  price: number;
  note?: string | null;

  product_name?: string; // Hanya digunakan sebagai informasi tambahan dan jika diperlukan
  product_image?: string; // Hanya digunakan sebagai informasi tambahan dan jika diperlukan
  product_stock_qty?: number | null; // Hanya digunakan sebagai informasi tambahan dan jika diperlukan
};

export type SalesTemporary = {
  customer_name?: string | null;
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  sales_details: SaleDetail[];
  total_gross: number;
  total_net: number;
  grand_total: number;
};

export type ProductQuantityFunctionProps = Pick<
  Product,
  "id" | "price" | "name" | "image" | "stock_qty"
>;
