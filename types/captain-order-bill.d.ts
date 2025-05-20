import { CaptainOrderBillDetail } from "./captain-order-bill-detail";

export type CaptainOrderBill = {
  id: number;
  op: string;
  code: string;
  customer_name: string;
  table_or_room_number: string;
  customer_adult_count: number;
  customer_child_count: number;
  total_qty: number;
  date: Date;
  total_gross: number;
  total_net: number;
  grand_total: number;
  discount_amount: number;
  is_print_as_copy: boolean;
  captain_order_bill_details: CaptainOrderBillDetail[];
};
