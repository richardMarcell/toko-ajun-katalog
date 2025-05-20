import { EntryPassCustomer } from "@/types/entry-pass-customer";
import { EntryPassCustomerHistory } from "@/types/entry-pass-customer-history";
import { Product } from "./general";

export type EntryPassCustomerWithHistories = EntryPassCustomer & {
  entryPassCustomerHistories: (EntryPassCustomerHistory & {
    product: Product;
  })[];
};
