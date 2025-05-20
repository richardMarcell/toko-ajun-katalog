import { db } from "@/db";
import { sql } from "drizzle-orm";
import { productCategories } from "../schema";

export async function productCategorySeeder() {
  await db
    .insert(productCategories)
    .values([])
    .onDuplicateKeyUpdate({
      set: {
        name: sql`values(${productCategories.name})`,
      },
    });
}
