import { db } from "@/db";
import { ProductConfig } from "@/lib/config/product-config";
import { Product } from "@/types/product";

export async function getGazeboFamilyProduct(): Promise<{
  gazeboFamily: Product | null;
}> {
  const gazeboFamily = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.id, ProductConfig.gazebo.family.id),
  });

  if (!gazeboFamily)
    return {
      gazeboFamily: null,
    };

  return {
    gazeboFamily: gazeboFamily,
  };
}
