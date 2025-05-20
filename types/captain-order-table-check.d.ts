import { CaptainOrderTableCheckDetail } from "./captain-order-table-check-detail";

export type CaptainOrderTableCheck = {
  id: number;
  op: string;
  code: string;
  customer_name: string;
  table_or_room_number: string;
  customer_adult_count: number;
  customer_child_count: number;
  total_qty: number;
  date: Date;
  is_print_as_copy: boolean;
  table_check_details: CaptainOrderTableCheckDetail[];
};
