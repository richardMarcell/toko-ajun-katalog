import { CaptainOrderKitchenDetail } from "./captain-order-kitchen-detail";

export type CaptainOrderKitchen = {
  id: number;
  op: string;
  code: string;
  outlet: string;
  customer_name: string;
  table_or_room_number: string;
  date: Date;
  is_print_as_copy: boolean;
  kitchen_details: CaptainOrderKitchenDetail[];
};
