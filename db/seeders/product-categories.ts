import { db } from "@/db";
import { sql } from "drizzle-orm";
import { productCategories } from "../schema";

export async function productCategorySeeder() {
  await db
    .insert(productCategories)
    .values([
      { name: "Bahan Pokok" },
      { name: "Makanan Ringan" },
      { name: "Minuman" },
      { name: "Produk Susu" },
      { name: "Bumbu & Rempah" },
      { name: "Makanan Instan" },
      { name: "Makanan Kaleng & Kemasan" },
      { name: "Alat Mandi & Sabun" },
      { name: "Deterjen & Pembersih" },
      { name: "Perlengkapan Dapur" },
      { name: "Rokok & Tembakau" },
      { name: "Gas & Bahan Bakar" },
      { name: "Plastik & Kantong" },
      { name: "Lain-lain" },
    ])
    .onDuplicateKeyUpdate({
      set: {
        name: sql`values(${productCategories.name})`,
      },
    });
}
