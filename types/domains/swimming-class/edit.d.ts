import { SwimmingClassCustomer } from "@/types/swimming-class-customer";
import { SwimmingClassCustomerHistory } from "@/types/swimming-class-customer-history";
import { Product } from "./general";

export type SwimmingClassCustomerWithHistories = SwimmingClassCustomer & {
  swimmingClassCustomerHistories: (SwimmingClassCustomerHistory & {
    product: Product;
  })[];
};
