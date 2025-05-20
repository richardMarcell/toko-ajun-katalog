import { db } from "@/db";

export async function getSale({ salesId }: { salesId: bigint }) {
  const sale = await db.query.sales.findFirst({
    where: (sales, { eq }) => eq(sales.id, salesId),
    with: {
      salesSwimsuitRent: true,
      salesDetails: {
        with: {
          product: true,
          swimsuitRentWallet: true,
        },
      },
    },
  });

  if (!sale) {
    return {
      sale: null,
    };
  }

  return {
    sale: sale,
  };
}
