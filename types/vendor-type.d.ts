import { vendorTypes } from "@/db/schema/vendor-types";
import { InferSelectModel } from "drizzle-orm";

export type VendorType = InferSelectModel<typeof vendorTypes>;
