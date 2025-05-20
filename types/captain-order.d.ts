import { captainOrders } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type CaptainOrder = InferSelectModel<typeof captainOrders>;
