export type EntryPassCustomer = {
  id: bigint;
  entry_pass_customer_history_id: bigint | null;
  name: string;
  registered_at: Date;
  valid_until: Date;
  product_name: string;
  price: string;
  can_make_payment: boolean;
};
