import { db } from "@/db";
import { productCategories } from "@/db/schema";
import { and, eq, like, not } from "drizzle-orm";
import * as yup from "yup";

export const updateProductCategoryValidationSchema = yup.object({
  product_category_id: yup
    .number()
    .required("Kategori Produk ID wajib diisi")
    .test(
      "is-product-category-exists",
      "Kategori produk tidak terdaftar dalam sistem",
      async function (productCategoryId) {
        const productCategory = await db.query.productCategories.findFirst({
          where: eq(productCategories.id, BigInt(productCategoryId)),
        });

        if (!productCategory) return false;

        return true;
      },
    ),
  name: yup
    .string()
    .required("Nama kategori wajib diisi")
    .test(
      "is-product-category-exists",
      "Kategori produk sudah terdaftar",
      async function (name) {
        const productCategoryId = this.parent.product_category_id;

        const productCategory = await db.query.productCategories.findFirst({
          where: and(
            like(productCategories.name, `%${name}%`),
            not(eq(productCategories.id, BigInt(productCategoryId))),
          ),
        });

        if (productCategory) return false;

        return true;
      },
    ),
});
