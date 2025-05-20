import { db } from "@/db";
import { bookletPromo, promos } from "../schema";
import { eq } from "drizzle-orm";

export async function bookletPromoSeeder() {
  const promo = await db.query.promos.findFirst({
    where: eq(promos.is_required_booklet, true),
  });

  const booklets = await db.query.booklets.findMany();

  const data: (typeof bookletPromo.$inferInsert)[] = booklets.map(
    (booklet) => ({
      booklet_id: booklet.id,
      promo_id: promo ? promo.id : BigInt(1),
      qty: 20,
    }),
  );

  await Promise.all(
    data.map((dataItem) =>
      db.insert(bookletPromo).values(dataItem).onDuplicateKeyUpdate({
        set: dataItem,
      }),
    ),
  );
}
