import { db } from "@/db";
import { ProductConfig } from "@/lib/config/product-config";
import { Product } from "@/types/product";

export async function getLockerProductList(): Promise<{
  lockerProductList: Product[];
}> {
  const lockerProductList = await db.query.products.findMany({
    where: (products, { inArray, and }) =>
      and(
        inArray(products.id, [
          ProductConfig.locker.standard.id,
          ProductConfig.locker.family.id,
        ]),
      ),
  });

  return {
    lockerProductList: lockerProductList,
  };
}
