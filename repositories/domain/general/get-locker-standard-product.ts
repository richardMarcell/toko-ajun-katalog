import { db } from "@/db";
import { ProductConfig } from "@/lib/config/product-config";
import { Product } from "@/types/product";

export async function getLockerStandardProduct(): Promise<{
  lockerStandard: Product | null;
}> {
  const lockerStandard = await db.query.products.findFirst({
    where: (products, { eq }) =>
      eq(products.id, ProductConfig.locker.standard.id),
  });

  if (!lockerStandard)
    return {
      lockerStandard: null,
    };

  return {
    lockerStandard: lockerStandard,
  };
}
