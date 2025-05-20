import { swimsuitRentWallet } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type SwimsuitRentWallet = InferSelectModel<typeof swimsuitRentWallet>;
