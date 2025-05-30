import { db } from "@/db";
import { sales, salesDetails } from "../schema";

export async function salesSeeder() {
  const isHasRecord = (await db.$count(sales)) > 0;

  if (!isHasRecord) {
    const dataSales: (typeof sales.$inferInsert)[] = [
      {
        code: "INV-0001",
        created_by: BigInt(2),
        grand_total: "66000",
      },
      {
        code: "INV-0002",
        created_by: BigInt(2),
        grand_total: "66000",
      },
    ];

    const dataSalesDetails: (typeof salesDetails.$inferInsert)[] = [
      {
        product_id: BigInt(1),
        price: "30000",
        sales_id: BigInt(1),
        subtotal: "30000",
        qty: 1,
      },
      {
        product_id: BigInt(2),
        price: "12000",
        sales_id: BigInt(1),
        subtotal: "36000",
        qty: 3,
      },
      {
        product_id: BigInt(1),
        price: "30000",
        sales_id: BigInt(2),
        subtotal: "30000",
        qty: 1,
      },
      {
        product_id: BigInt(2),
        price: "12000",
        sales_id: BigInt(2),
        subtotal: "36000",
        qty: 3,
      },
    ];

    await Promise.all(
      dataSales.map((dataItem) =>
        db.insert(sales).values(dataItem).onDuplicateKeyUpdate({
          set: dataItem,
        }),
      ),
    );

    await Promise.all(
      dataSalesDetails.map((dataItem) =>
        db.insert(salesDetails).values(dataItem).onDuplicateKeyUpdate({
          set: dataItem,
        }),
      ),
    );
  }
}
