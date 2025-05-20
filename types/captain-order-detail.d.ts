import { captainOrderDetails } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type CaptainOrderDetail = InferSelectModel<typeof captainOrderDetails>;
