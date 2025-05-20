import { Promo } from "@/types/promo";

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
  discount_amount: number;
  discount_percent: number;
  is_festive: boolean;
  grand_total: number;
  sales_details: SalesDetail[];

  wristband_qty: number;
  total_deposit: number;
  wristband_code_list: string[];
};

export type BookletPromoWithRelation = {
  promo: Promo;
  booklet_code: string;
  limit: number;
  total_used: number;
  remaining_coupon_quota: number;
};

export type BookletUsedPromoHistories = {
  id: bigint;
  created_at: Date;
  limit: number;
  total_used: number;
};
