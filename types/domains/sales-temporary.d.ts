// Note 26/03/2025: Type ini belum digunakan untuk saat ini

export type SalesTemporary<T extends SalesType> = SalesTemporaryBase &
  SalesTypeMap[T] &
  OmitUnion<SalesTypeMap, T>;

export type SalesDetail = {
  product_id: number;
  qty: number;
  price: number;
  note?: string | null;
};

type SalesFoodCorner = {
  table_number?: string | null;
  order_type: string;
};

type SalesDimsum = {
  table_number?: string | null;
  customer_name?: string | null;
  order_type: string;
};

type SalesSouvenir = {
  customer_name?: string | null;
};

type SalesLockerSouvenir = {
  customer_name?: string | null;
};

type SalesTicket = {
  customer_name: string;
  customer_phone_number: string;
  customer_origin_id: number | null;
  is_festive: boolean;
  wristband_qty: number;
  total_deposit: number;
  wristband_code_list: string[];
  created_at: Date;
};

type SalesType =
  | "sales_food_corner"
  | "sales_dimsum"
  | "sales_souvenir"
  | "sales_locker_souvenir"
  | "sales_ticket";

type SalesTypeMap = {
  sales_food_corner: { sales_food_corner: SalesFoodCorner };
  sales_dimsum: { sales_dimsum: SalesDimsum };
  sales_souvenir: { sales_souvenir: SalesSouvenir };
  sales_locker_souvenir: { sales_locker_souvenir: SalesLockerSouvenir };
  sales_ticket: { sales_ticket: SalesTicket };
};

type OmitUnion<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]?: T[P];
};

type SalesTemporaryBase = {
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  total_gross: number;
  total_net: number;
  grand_total: number;
  sales_details: SalesDetail[];
};
