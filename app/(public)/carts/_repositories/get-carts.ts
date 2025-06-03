import { db } from "@/db";
import { carts as cartSchema } from "@/db/schema";
import { Cart } from "@/types/cart";
import { Product } from "@/types/product";
import { eq } from "drizzle-orm";

export type CartIncludeRelationship = Cart & {
  product: Product;
};

export async function getCarts(
  userId: string,
): Promise<{ carts: CartIncludeRelationship[] }> {
  const carts = await db.query.carts.findMany({
    where: eq(cartSchema.user_id, BigInt(userId)),
    with: {
      product: true,
    },
  });

  return { carts };
}
