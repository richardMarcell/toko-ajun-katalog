import { db } from "@/db";
import { VendorType } from "@/types/vendor-type";

export async function getVendorTypes(): Promise<{
  vendorTypes: VendorType[];
}> {
  const vendorTypes = await db.query.vendorTypes.findMany();

  return {
    vendorTypes: vendorTypes,
  };
}
