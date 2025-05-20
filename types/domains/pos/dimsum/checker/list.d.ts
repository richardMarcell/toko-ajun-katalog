export type SalesDetail = {
  id: bigint;
  note?: string | null;
  qty: number;
  created_at: Date;
  order_number: string | null;
  product_name: string | null;
  table_number: string | null;
};
