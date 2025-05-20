export type Sale = {
  id: bigint;
  code: string;
  created_at: Date;
  wristband_code: string;
  customer_name: string;
  customer_phone_number: string;
  is_has_item_not_returned: boolean;
};
