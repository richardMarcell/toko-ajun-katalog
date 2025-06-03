import { carts } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Cart = InferSelectModel<typeof carts>;
