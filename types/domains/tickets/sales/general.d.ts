export type Product = {
  id: bigint;
  code: string;
  name: string;
  price: string;
  description: string;
};

export type SalesDetail = {
  product_id: number;
  code: string;
  name: string;
  price: number;
  description: string;
  qty: number;
};

export type CustomerOrigin = {
  id: bigint;
  name: string;
};

export type SalesTemporary = {
  customer_name: string;
  customer_phone_number: string;
  customer_origin_id: number | null;
  tax_percent: number;
  tax_amount: number;
  total_gross: number;
  total_net: number;
  is_festive: boolean;
  grand_total: number;
  sales_details: SalesDetail[];

  wristband_qty: number;
  total_deposit: number;
  wristband_code_list: string[];
};
