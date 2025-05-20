export type Product = {
  id: bigint;
  code: string;
  name: string;
  price: string;
  description: string;
};

export type SalesDetail = {
  product_id: number;
  price: number;
  qty: number;
};

export type CustomerOrigin = {
  id: bigint;
  name: string;
};

export type Sales = {
  customer_name: string;
  customer_phone_number: string;
  customer_origin_id: number | null;
  sales_details: SalesDetail[];
  ota_redeem_code: string;
  vendor_type_code: string;
};
