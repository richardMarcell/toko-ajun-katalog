import { db } from "@/db";
import { sql } from "drizzle-orm";
import { productCategories } from "../schema/product-categories";

export async function productCategorySeeder() {
  await db
    .insert(productCategories)
    .values([
      { id: BigInt(1), name: "Main Course" },
      { id: BigInt(2), name: "Lunch" },
      { id: BigInt(3), name: "Dinner" },
      { id: BigInt(4), name: "Soup" },
      { id: BigInt(5), name: "Desserts" },
      { id: BigInt(6), name: "Side Dish" },
      { id: BigInt(7), name: "Appetizer" },
      { id: BigInt(8), name: "Beverages" },
      { id: BigInt(9), name: "Swimming Accessories" },
      { id: BigInt(10), name: "Swimming Equipment" },
      { id: BigInt(11), name: "Bath Essentials" },
      { id: BigInt(12), name: "Skincare" },
      { id: BigInt(13), name: "Swimming Class" },
      { id: BigInt(14), name: "Entry Pass" },
      { id: BigInt(15), name: "Locker" },
      { id: BigInt(16), name: "Locker Gazebo" },
      { id: BigInt(17), name: "Dimsum" },
      { id: BigInt(18), name: "Water Park Ticket" },
      { id: BigInt(19), name: "Wristband" },
      { id: BigInt(20), name: "Top Up" },
      { id: BigInt(21), name: "Resto Special Item" },
    ])
    .onDuplicateKeyUpdate({
      set: {
        name: sql`values(${productCategories.name})`,
      },
    });
}
