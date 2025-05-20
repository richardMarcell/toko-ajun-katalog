import { wallets } from "@/db/schema";

export type Wallet = InferSelectModel<typeof wallets>