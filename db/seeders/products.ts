import { db } from "@/db";
import { products } from "../schema";

export async function productSeeder() {
  const isHasRecord = (await db.$count(products)) > 0;

  if (!isHasRecord) {
    const data: (typeof products.$inferInsert)[] = [
      {
        code: "BPK-0001",
        description:
          "Minyak goreng pilihan terbaik bagi ibu-ibu untuk masak di rumah",
        image: "/minyak-goreng.jpg",
        name: "Minyak Goreng",
        price: "30000",
        product_category_id: BigInt(1),
      },
      {
        code: "BPK-0002",
        description: "Cemilang roti dengan biskuit dan krim vanilla pilihan",
        image: "/oreo.png",
        name: "Oreo",
        price: "12000",
        product_category_id: BigInt(1),
      },
    ];

    await Promise.all(
      data.map((dataItem) =>
        db.insert(products).values(dataItem).onDuplicateKeyUpdate({
          set: dataItem,
        }),
      ),
    );
  }
}
