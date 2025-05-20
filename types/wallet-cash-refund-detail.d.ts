import { walletCashRefundDetails } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type WalletCashRefundDetail = InferSelectModel<typeof walletCashRefundDetails>;
