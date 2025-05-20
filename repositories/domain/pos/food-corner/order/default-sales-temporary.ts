import { OrderTypeEnum } from "@/lib/enums/OrderTypeEnum";

export const defaultSalesTemporary = {
  customer_name: "",
  order_type: OrderTypeEnum.DINE_IN,
  table_number: "",
  discount_percent: 0,
  discount_amount: 0,
  tax_percent: 0,
  tax_amount: 0,
  sales_details: [],
  total_gross: 0,
  total_net: 0,
  grand_total: 0,
};
