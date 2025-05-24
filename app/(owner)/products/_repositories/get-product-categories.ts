import { db } from "@/db";
import { ProductCategory } from "@/types/product-category";

export async function getProductCategories(): Promise<{
  productCategories: ProductCategory[];
}> {
  const productCategories = await db.query.productCategories.findMany();

  return {
    productCategories: productCategories,
  };
}
