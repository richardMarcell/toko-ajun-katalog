import { db } from "@/db";
import { stockSwimsuitRent } from "../schema/stock-swimsuit-rent";

export async function stockSwimsuitRentSeeder() {
  const isHasRecord = (await db.$count(stockSwimsuitRent)) > 0;

  if (!isHasRecord) {
    const data: (typeof stockSwimsuitRent.$inferInsert)[] = [
      {
        product_id: BigInt(20),
        qty: 10,
      },
      {
        product_id: BigInt(21),
        qty: 10,
      },
      {
        product_id: BigInt(22),
        qty: 10,
      },
    ];

    await Promise.all(
      data.map((dataItem) =>
        db.insert(stockSwimsuitRent).values(dataItem).onDuplicateKeyUpdate({
          set: dataItem,
        }),
      ),
    );
  }
}
