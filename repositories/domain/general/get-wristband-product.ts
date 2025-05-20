import { db } from "@/db";
import { ProductConfig } from "@/lib/config/product-config";
import { Product } from "@/types/product";

export async function getWristbandProduct(): Promise<{
  wristbandProduct: Product | null;
}> {
  const wristbandProduct = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.id, ProductConfig.wristband.id),
  });

  if (!wristbandProduct)
    return {
      wristbandProduct: null,
    };

  return {
    wristbandProduct: wristbandProduct,
  };
}
