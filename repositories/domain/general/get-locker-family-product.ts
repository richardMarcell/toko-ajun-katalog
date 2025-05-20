import { db } from "@/db";
import { ProductConfig } from "@/lib/config/product-config";
import { Product } from "@/types/product";

export async function getLockerFamilyProduct(): Promise<{
  lockerFamily: Product | null;
}> {
  const lockerFamily = await db.query.products.findFirst({
    where: (products, { eq }) =>
      eq(products.id, ProductConfig.locker.family.id),
  });

  if (!lockerFamily)
    return {
      lockerFamily: null,
    };

  return {
    lockerFamily: lockerFamily,
  };
}
