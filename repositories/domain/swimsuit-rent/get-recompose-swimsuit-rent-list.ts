import { db } from "@/db";
import { products } from "@/db/schema";
import { SaleDetail } from "@/types/domains/swimsuit-rent/general";
import { inArray } from "drizzle-orm";

export async function getRecomposeSwimsuitRentList(
  salesDetails: SaleDetail[],
): Promise<SaleDetail[]> {
  const productIds = salesDetails.map(({ product_id }) => BigInt(product_id));

  const productList = await db
    .select({ id: products.id, price: products.price })
    .from(products)
    .where(inArray(products.id, productIds));

  const productsPriceMap = new Map(
    productList.map(({ id, price }) => [Number(id), Number(price)]),
  );

  const salesDetailsMapped = salesDetails.map(
    ({
      product_id,
      qty,
      product_code,
      product_description,
      product_stock_qty,
      product_image,
      product_name,
    }) => ({
      product_id,
      qty,
      price: productsPriceMap.get(product_id) ?? 0,
      product_code,
      product_description,
      product_image,
      product_name,
      product_stock_qty,
    }),
  );

  return salesDetailsMapped;
}
