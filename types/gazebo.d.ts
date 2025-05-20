import { gazebos } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Gazebo = InferSelectModel<typeof gazebos>;
