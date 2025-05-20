import { db } from "@/db";
import { ProductConfig } from "@/lib/config/product-config";
import { Product } from "@/types/product";

export async function getGazeboProductList(): Promise<{
  gazeboProductList: Product[];
}> {
  const gazeboProductList = await db.query.products.findMany({
    where: (products, { inArray, and }) =>
      and(
        inArray(products.id, [
          ProductConfig.gazebo.family.id,
          ProductConfig.gazebo.vip.id,
        ]),
      ),
  });

  return {
    gazeboProductList: gazeboProductList,
  };
}
