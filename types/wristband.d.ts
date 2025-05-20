import { wristbands } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Wristband = InferSelectModel<typeof wristbands>;
