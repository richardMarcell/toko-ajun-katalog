import { db } from "@/db";
import { sales } from "@/db/schema";
import { Product } from "@/types/product";
import { Sale } from "@/types/sale";
import { SaleDetail } from "@/types/sale-detail";
import { eq } from "drizzle-orm";

type SaleIncluRelationship = Sale & {
  salesDetails: (SaleDetail & {
    product: Product;
  })[];
};

export async function getSale({
  saleId,
}: {
  saleId: string;
}): Promise<{ sale: SaleIncluRelationship | null }> {
  const sale = await db.query.sales.findFirst({
    where: eq(sales.id, BigInt(saleId)),
    with: {
      salesDetails: {
        with: {
          product: true,
        },
      },
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
