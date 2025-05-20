import { swimmingClassCustomers } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type SwimmingClassCustomer = InferSelectModel<
  typeof swimmingClassCustomers
>;
