import { walletCashRefunds } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type WalletCashRefund = InferSelectModel<typeof walletCashRefunds>;
