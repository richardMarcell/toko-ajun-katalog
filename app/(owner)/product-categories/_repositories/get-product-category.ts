import { db } from "@/db";
import { productCategories } from "@/db/schema";
import { ProductCategory } from "@/types/product-category";
import { eq } from "drizzle-orm";

export async function getUser({
  productCategoryId,
}: {
  productCategoryId: string;
}): Promise<{ productCategory: ProductCategory | null }> {
  const productCategory = await db.query.productCategories.findFirst({
    where: eq(productCategories.id, BigInt(productCategoryId)),
  });

  if (!productCategory)
    return {
      productCategory: null,
    };

  return {
    productCategory: productCategory,
  };
}
