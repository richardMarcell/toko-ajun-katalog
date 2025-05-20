import { rooms } from "@/db/schema/rooms";
import { InferSelectModel } from "drizzle-orm";

export type Room = InferSelectModel<typeof rooms>;
