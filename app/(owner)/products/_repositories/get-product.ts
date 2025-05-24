import { db } from "@/db";
import { products } from "@/db/schema";
import { Product } from "@/types/product";
import { eq } from "drizzle-orm";

export async function getProduct({
  productId,
}: {
  productId: string;
}): Promise<{ product: Product | null }> {
  const product = await db.query.products.findFirst({
    where: eq(products.id, BigInt(productId)),
  });

  if (!product)
    return {
      product: null,
    };

  return {
    product: product,
  };
}
