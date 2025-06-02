import { db } from "@/db";
import { products as productSchema } from "@/db/schema";
import { Product } from "@/types/product";
import { and, eq, ilike } from "drizzle-orm";

export async function getProducts({
  searchParams,
}: {
  searchParams: {
    keyword: string;
    productCategoryId: string;
  };
}): Promise<{ products: Product[] }> {
  const keyword = searchParams.keyword?.trim() || "";
  const productCategoryId = searchParams.productCategoryId
    ? BigInt(searchParams.productCategoryId)
    : null;

  // Siapkan kondisi dinamis
  const conditions = [];

  if (keyword) {
    conditions.push(ilike(productSchema.name, `%${keyword}%`));
  }

  if (productCategoryId) {
    conditions.push(eq(productSchema.product_category_id, productCategoryId));
  }

  const products = await db.query.products.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: (products, { asc }) => asc(products.id),
  });

  return {
    products,
  };
}
