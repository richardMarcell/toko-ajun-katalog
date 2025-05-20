import { db } from "@/db";
import { products } from "../schema";

export async function productSeeder() {
  const isHasRecord = (await db.$count(products)) > 0;

  if (!isHasRecord) {
    const data: (typeof products.$inferInsert)[] = [];

    await Promise.all(
      data.map((dataItem) =>
        db.insert(products).values(dataItem).onDuplicateKeyUpdate({
          set: dataItem,
        }),
      ),
    );
  }
}
