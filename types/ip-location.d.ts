import { ipLocations } from "@/db/schema/ip-locations";
import { InferSelectModel } from "drizzle-orm";

export type IpLocation = InferSelectModel<typeof ipLocations>;
