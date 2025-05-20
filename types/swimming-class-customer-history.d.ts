import { swimmingClassCustomerHistories } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type SwimmingClassCustomerHistory = InferSelectModel<
  typeof swimmingClassCustomerHistories
>;
