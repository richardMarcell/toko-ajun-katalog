import { db } from "@/db";
import { ProductConfig } from "@/lib/config/product-config";
import { Product } from "@/types/product";

export async function getTopUpProduct(): Promise<{
  topUpProduct: Product | null;
}> {
  const topUpProduct = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.id, ProductConfig.top_up.id),
  });

  if (!topUpProduct)
    return {
      topUpProduct: null,
    };

  return {
    topUpProduct: topUpProduct,
  };
}
