import { EntryPassCustomer } from "@/types/entry-pass-customer";
import { EntryPassCustomerHistory } from "@/types/entry-pass-customer-history";
import { Product } from "@/types/product";

export type EntryPassCustomerHistoryIncludeRelations =
  EntryPassCustomerHistory & {
    product: Product;
    entryPassCustomer: EntryPassCustomer;
  };
