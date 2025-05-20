import { db } from "@/db";
import { ProductConfig } from "@/lib/config/product-config";
import { Product } from "@/types/product";

export async function getGazeboVipProduct(): Promise<{
  gazeboVip: Product | null;
}> {
  const gazeboVip = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.id, ProductConfig.gazebo.vip.id),
  });

  if (!gazeboVip)
    return {
      gazeboVip: null,
    };

  return {
    gazeboVip: gazeboVip,
  };
}
