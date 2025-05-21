import { db } from "@/db";
import { productCategories } from "@/db/schema";
import { like } from "drizzle-orm";
import * as yup from "yup";

export const storeProductCategoryValidationSchema = yup.object({
  name: yup
    .string()
    .required("Nama kategori wajib diisi")
    .test(
      "is-product-category-exists",
      "Kategori produk sudah terdaftar",
      async function (name) {
        const productCategory = await db.query.productCategories.findFirst({
          where: like(productCategories.name, `%${name}%`),
        });

        if (productCategory) return false;

        return true;
      },
    ),
});
