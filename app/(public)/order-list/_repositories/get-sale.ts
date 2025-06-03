import { db } from "@/db";
import { sales } from "@/db/schema";
import { Product } from "@/types/product";
import { Sale } from "@/types/sale";
import { SaleDetail } from "@/types/sale-detail";
import { User } from "@/types/user";
import { eq } from "drizzle-orm";

export type SaleIncluRelationship = Sale & {
  salesDetails: (SaleDetail & {
    product: Product;
  })[];
  user: User;
};

export async function getSale({
  salesId,
}: {
  salesId: string;
}): Promise<{ sale: SaleIncluRelationship | null }> {
  const sale = await db.query.sales.findFirst({
    where: eq(sales.id, BigInt(salesId)),
    with: {
      salesDetails: {
        with: {
          product: true,
        },
      },
      user: true,
    },
  });

  if (!sale)
    return {
      sale: null,
    };

  return {
    sale: sale,
  };
}
