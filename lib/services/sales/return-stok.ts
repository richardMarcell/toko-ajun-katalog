import { stocks } from "@/db/schema";
import { ProductStockTypeEnum } from "@/lib/enums/ProductStockTypeEnum";
import { DatabaseTransaction } from "@/types/db-transaction";
import { and, eq, sql } from "drizzle-orm";

export default async function returnStok({
  warehouseId,
  productId,
  qty,
  stock_type,
  tx,
}: {
  warehouseId: string;
  productId: bigint;
  qty: number;
  stock_type: string;
  tx: DatabaseTransaction;
}): Promise<void> {
  const isNonStockProduct = stock_type === ProductStockTypeEnum.NON_STOCK;

  if (isNonStockProduct) return;

  await tx
    .update(stocks)
    .set({
      qty: sql`${stocks.qty} + ${qty}`,
    })
    .where(
      and(
        eq(stocks.product_id, productId),
        eq(stocks.warehouse_id, warehouseId),
      ),
    );
}
