// import { db } from "@/db";
import { stocks } from "@/db/schema";
import { ProductStockTypeEnum } from "@/lib/enums/ProductStockTypeEnum";
import { DatabaseTransaction } from "@/types/db-transaction";
import { SalesIncludeRelation } from "@/types/sale";
import { and, eq, sql } from "drizzle-orm";

export async function deductStockFromSales({
  sales,
  tx,
}: {
  sales: SalesIncludeRelation;
  tx: DatabaseTransaction;
}): Promise<void> {
  for (const salesDetail of sales.salesDetails) {
    const isNonStockProduct =
      salesDetail.product.stock_type === ProductStockTypeEnum.NON_STOCK;

    if (isNonStockProduct) continue;

    await tx
      .update(stocks)
      .set({
        qty: sql`${stocks.qty} - ${salesDetail.qty}`,
      })
      .where(
        and(
          eq(stocks.product_id, salesDetail.product_id),
          eq(stocks.warehouse_id, salesDetail.warehouse_id),
        ),
      );
  }
}
