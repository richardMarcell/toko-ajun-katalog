import { Product } from "@/types/product";
import { SwimmingClassCustomer } from "@/types/swimming-class-customer";
import { SwimmingClassCustomerHistory } from "@/types/swimming-class-customer-history";

export type SwimmingClassCustomerHistoryIncludeRelations =
  SwimmingClassCustomerHistory & {
    product: Product;
    swimmingClassCustomer: SwimmingClassCustomer;
  };
